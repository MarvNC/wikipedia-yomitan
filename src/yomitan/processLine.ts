import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { parseLine } from '../parse/parseLine';
import {
  StructuredContent,
  StructuredContentNode,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';
import { languages, linkCharacter } from '../constants';

/**
 * Reads a line and adds that term entry to the dictionary
 */
export function processLine(line: string, dict: Dictionary, lang: string) {
  const { term, termSlug, termSpecifier, reading, definition } = parseLine(
    line,
    lang
  );
  const termEntry = createTermEntry(term, reading);
  const structuredContentList = createStructuredContentList(
    termSpecifier,
    definition,
    termSlug,
    lang
  );

  termEntry.addDetailedDefinition({
    type: 'structured-content',
    content: structuredContentList,
  });

  dict.addTerm(termEntry.build());
}

// Helper functions
function createTermEntry(term: string, reading: string): TermEntry {
  const termEntry = new TermEntry(term);
  termEntry.setReading(reading);
  return termEntry;
}

function createStructuredContentList(
  termSpecifier: string | null,
  definition: string,
  termSlug: string,
  lang: string
): StructuredContent[] {
  const structuredContentList: StructuredContent[] = [];

  if (termSpecifier) {
    structuredContentList.push(createTermSpecifierNode(termSpecifier));
  }

  structuredContentList.push(createDefinitionNode(definition));
  structuredContentList.push(createReadMoreNode(termSlug, lang));

  return structuredContentList;
}

function createTermSpecifierNode(termSpecifier: string): StructuredContentNode {
  return {
    tag: 'div',
    content: `«${termSpecifier}»`,
    data: {
      wikipedia: 'term-specifier',
    },
    style: {
      fontSize: '1.5em',
    },
  };
}

function createDefinitionNode(definition: string): StructuredContentNode {
  const definitionStrings = definition.split('\\n').map((line) => line.trim());
  return {
    tag: 'ul',
    content: definitionStrings.map((definitionString) => ({
      tag: 'li',
      content: definitionString,
    })),
    data: {
      wikipedia: 'abstract',
    },
  };
}

function createReadMoreNode(
  termSlug: string,
  lang: string
): StructuredContentNode {
  const articleLink = `https://${lang.toLowerCase()}.wikipedia.org/wiki/${termSlug}`;
  const readTheRest = getReadMoreText(lang);
  return {
    tag: 'ul',
    content: [
      {
        tag: 'li',
        content: [
          {
            tag: 'a',
            href: articleLink,
            content: readTheRest,
          },
        ],
      },
    ],
    data: {
      wikipedia: 'continue-reading',
    },
    style: {
      listStyleType: `"${linkCharacter}"`,
    },
  };
}

function getReadMoreText(lang: string): string {
  switch (lang) {
    case languages.ja:
      return '続きを読む';
    case languages.zh:
      return '查看更多';
    default:
      return 'Read more';
  }
}
