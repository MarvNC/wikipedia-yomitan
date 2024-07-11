import { file } from 'bun';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';

import { parseLine } from './parse/parseLine';
import { languages } from './constants';
import { getVersion } from './util/getVersion';
import type {
  StructuredContent,
  StructuredContentNode,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';

const linkCharacter = '⧉';

const outputZipName = (lang: string, date: string, version: string) =>
  `${lang} Wikipedia [${date}] (v${version}).zip`;
const shortAbstractFile = (lang: string) =>
  `short-abstracts_lang=${lang.toLowerCase()}.ttl`;

(async () => {
  const version = getVersion();

  console.log(`Using version ${version}`);

  const { lang, date } = readArgs();
  console.log(`Converting ${lang} Wikipedia dump from ${date}...`);

  const filePath = shortAbstractFile(lang);
  const fileHandle = file(filePath);
  const fileReader = fileHandle.stream();
  const lineReader = fileReader.getReader();

  const dict = new Dictionary({
    // @ts-ignore
    fileName: outputZipName(lang, date, version),
  });

  let processedLines = 0;
  let buffer = '';

  while (true) {
    const { done, value } = await lineReader.read();
    if (done) break;

    buffer += new TextDecoder().decode(value);
    let lineEnd;

    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEnd);
      await processLine(line.trim(), dict, lang);
      buffer = buffer.slice(lineEnd + 1);
      processedLines++;

      if (processedLines % 1000 === 0) {
        console.log(`Processed ${processedLines} lines`);
      }
    }
  }

  console.log(`Processed ${processedLines} lines, exporting zip...`);

  await dict.setIndex({
    title: `${lang} Wikipedia [${date}] (v${version})`,
    revision: `wikipedia_${new Date().toISOString()}`,
    format: 3,
    url: 'https://github.com/MarvNC/wikipedia-yomitan',
    description: `Wikipedia short abstracts from the DBPedia dataset available at https://databus.dbpedia.org/dbpedia/text/short-abstracts.

Recommended custom CSS:
div.gloss-sc-div[data-sc-wikipedia=term-specifier] {
  color: #e5007f;
}`,
    author: 'Wikipedians, DBPedia, Marv',
    attribution: `https://${lang.toLowerCase()}.wikipedia.org/`,
  });

  await dict.export('./');
  console.log(`Exported to ${outputZipName(lang, date, version)}`);
})().catch((e) => {
  console.error(e);
});

/**
 * Reads a line and adds that term entry to the dictionary
 */
function processLine(line: string, dict: Dictionary, lang: string) {
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

function readArgs() {
  // Read arguments: node convertWikipedia.js [language] [date of dump]
  const langInput = process.argv[2].toLowerCase() as keyof typeof languages;
  // Assert language is valid
  if (!languages[langInput]) {
    throw new Error(
      `Language ${langInput} is not allowed. Allowed languages: ${Object.keys(
        languages
      ).join(', ')}`
    );
  }

  const lang = languages[langInput];

  const dateInput = process.argv[3];
  // Assert date is valid in format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    throw new Error(`Date ${dateInput} is not valid. Format: YYYY-MM-DD`);
  }
  return { lang, date: dateInput };
}
