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

  const termEntry = new TermEntry(term);
  termEntry.setReading(reading);

  const structuredContentList: StructuredContent[] = [];

  // Add term specifier heading if exists
  if (termSpecifier) {
    const specifierSCNode: StructuredContentNode = {
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

    structuredContentList.push(specifierSCNode);
  }

  const definitionStrings = definition.split('\\n').map((line) => line.trim());
  const definitionUList: StructuredContentNode = {
    tag: 'ul',
    content: definitionStrings.map((definitionString) => ({
      tag: 'li',
      content: definitionString,
    })),
    data: {
      wikipedia: 'abstract',
    },
  };
  structuredContentList.push(definitionUList);

  // Read more
  const articleLink = `https://${lang.toLowerCase()}.wikipedia.org/wiki/${termSlug}`;
  const readTheRest =
    lang === languages.ja
      ? '続きを読む'
      : lang === languages.zh
      ? '查看更多'
      : 'Read more';
  const linkSC: StructuredContentNode = {
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
  structuredContentList.push(linkSC);

  termEntry.addDetailedDefinition({
    type: 'structured-content',
    content: structuredContentList,
  });

  dict.addTerm(termEntry.build());
}
