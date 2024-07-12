import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { parseLine } from '../parse/parseLine';
import {
  StructuredContent,
  StructuredContentNode,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';
import { LanguageCode, WIKIPEDIA_ICON_FILEPATH } from '../constants';

/**
 * Reads a line and adds that term entry to the dictionary
 */
export function processLine(
  line: string,
  dict: Dictionary,
  lang: LanguageCode
) {
  const { term, termSlug, termSpecifier, reading, definition } = parseLine(
    line,
    lang
  );
  const termEntry = new TermEntry(term);
  termEntry.setReading(reading);

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

function createStructuredContentList(
  termSpecifier: string | null,
  definition: string,
  termSlug: string,
  lang: LanguageCode
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
      color: '#e5007f',
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
  lang: LanguageCode
): StructuredContentNode {
  const articleLink = `https://${lang.toLowerCase()}.wikipedia.org/wiki/${termSlug}`;
  return {
    tag: 'div',
    content: [
      {
        tag: 'span',
        content: [
          {
            tag: 'img',
            path: WIKIPEDIA_ICON_FILEPATH,
            collapsed: false,
            collapsible: false,
            height: 1,
            width: 1,
            sizeUnits: 'em',
            verticalAlign: 'middle',
          },
          ' ',
          {
            tag: 'a',
            href: articleLink,
            content: `Wikipedia`,
          },
        ],
      },
    ],
    data: {
      wikipedia: 'footer',
    },
    style: {
      textAlign: 'end',
    },
  };
}
