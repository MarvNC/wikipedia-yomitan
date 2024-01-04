import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';

import { parseLine } from './parseLine.js';
import { languagesAllowed } from './constants.js';

const linkCharacter = '⧉';
/**
 *
 * @param {string} lang
 * @param {string} date
 * @param {string} version
 * @returns
 */
const outputZipName = (lang, date, version) =>
  `${lang} Wikipedia [${date}] (v${version}).zip`;
const shortAbstractFile = (lang) =>
  `short-abstracts_lang=${lang.toLowerCase()}.ttl`;

(async () => {
  const version = await getVersion();

  console.log(`Using version ${version}`);

  const { lang, date } = readArgs();
  console.log(`Converting ${lang} Wikipedia dump from ${date}...`);

  const filePath = shortAbstractFile(lang);
  const fileStream = fs.createReadStream(filePath);
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const dict = new Dictionary({
    // @ts-ignore
    fileName: outputZipName(lang, date, version),
  });

  let processedLines = 0;
  for await (const line of lineReader) {
    await processLine(line, dict, lang);
    processedLines++;
    if (processedLines % 1000 === 0) {
      console.log(`Processed ${processedLines} lines`);
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
 * @param {string} line
 * @param {Dictionary} dict
 * @param {string} lang
 */
function processLine(line, dict, lang) {
  const { term, termSlug, termSpecifier, reading, definition } = parseLine(
    line,
    lang,
  );

  const termEntry = new TermEntry(term);
  termEntry.setReading(reading);

  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const structuredContentList = [];

  // Add term specifier heading if exists
  if (termSpecifier) {
    /**
     * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContentNode}
     */
    const specifierSCNode = {
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
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContentNode}
   */
  const definitionUList = {
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
    lang === languagesAllowed.ja
      ? '続きを読む'
      : lang === languagesAllowed.zh
        ? '查看更多'
        : 'Read more';
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContentNode}
   */
  const linkSC = {
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
  const langInput = process.argv[2];
  // Assert language is valid
  if (!languagesAllowed[langInput.toLowerCase()]) {
    throw new Error(
      `Language ${langInput} is not allowed. Allowed languages: ${Object.keys(
        languagesAllowed,
      ).join(', ')}`,
    );
  }

  const lang = languagesAllowed[langInput.toLowerCase()];

  const dateInput = process.argv[3];
  // Assert date is valid in format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    throw new Error(`Date ${dateInput} is not valid. Format: YYYY-MM-DD`);
  }
  return { lang, date: dateInput };
}

function getVersion() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}
