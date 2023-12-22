import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { pinyin } from 'pinyin-pro';

const languagesAllowed = {
  ja: 'JA',
  zh: 'ZH',
};

const linkCharacter = '⧉';
const outputZipName = (lang) =>
  `[${lang}-${lang} Encyclopedia] ${lang} Wikipedia.zip`;
const shortAbstractFile = (lang) =>
  `short-abstracts_lang=${lang.toLowerCase()}.ttl`;

(async () => {
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
    fileName: outputZipName(lang),
  });

  let processedLines = 0;
  for await (const line of lineReader) {
    await processLine(line, dict, lang);
    processedLines++;
    if (processedLines % 1000 === 0) {
      console.log(`Processed ${processedLines} lines`);
    }
  }

  console.log(`Processed ${processedLines} lines, exporting...`);

  await dict.setIndex({
    title: `${lang} Wikipedia [${date}]`,
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
  console.log(`Exported to ${outputZipName(lang)}`);
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
  // remove last 6 characters
  line = line.slice(0, -6);
  const [resource, definition] = line.split(
    '> <http://www.w3.org/2000/01/rdf-schema#comment> "'
  );
  let termSlug = resource.split('.dbpedia.org/resource/').pop();
  if (!termSlug) {
    throw new Error(`Could not parse term slug from ${resource}`);
  }
  termSlug = decodeURIComponent(termSlug);
  let termSpecifier = '';
  let term;
  if (termSlug.includes('_(')) {
    termSpecifier = termSlug.split('_(')[1].split(')')[0];
    term = termSlug.split('_(')[0];
  } else {
    term = termSlug;
  }
  term = term.replace(/_/g, ' ');

  const termEntry = new TermEntry(term);

  let reading = '';
  if (lang === languagesAllowed.ja) {
    reading = getReadingFromDefinition(definition, term);
  } else if (lang === languagesAllowed.zh) {
    reading = pinyin(term, { mode: 'surname' });
    reading = reading.replace(/ /g, '');
  }
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

/**
 * @param {string} definition
 * @param {string} term
 * @returns {string}
 */
function getReadingFromDefinition(definition, term) {
  const bracketRegex = /[(（]([^)）]*)/g;
  const bracketMatches = bracketRegex.exec(definition);
  // @ts-ignore
  if (bracketMatches?.length >= 1) {
    // @ts-ignore
    const bracketContent = bracketMatches[1];
    // Check if the bracket is at the beginning of the definition or closely following the term
    const bracketIndex = definition.indexOf(bracketContent);
    const termIndex = definition.indexOf(term) ?? 0;
    const termEndIndex = termIndex + term.length;
    if (bracketIndex - termEndIndex > 5) {
      return '';
    }
    return parseReadingFromBrackets(bracketContent, term);
  }
  return '';
}

/**
 * @param {string} bracketContent
 * @param {string} term
 * @returns {string}
 */
function parseReadingFromBrackets(bracketContent, term) {
  if (!bracketContent) return '';

  const commaRegex = /,|、/g;
  const kanjiRegex = /[一-龯]/g;

  const readings = bracketContent.split(commaRegex);

  const noKanji = readings.filter((reading) => !kanjiRegex.test(reading));

  const latinRegex = /[a-zA-Z]/g;
  const termHasLatin = latinRegex.test(term);

  const readingCandidates = termHasLatin
    ? noKanji.filter((reading) => latinRegex.test(reading))
    : noKanji;

  if (readingCandidates.length > 0) {
    let reading = readingCandidates[0];
    reading = reading.replace(/ /g, '');
    return reading;
  }

  return '';
}

function readArgs() {
  // Read arguments: node convertWikipedia.js [language] [date of dump]
  const langInput = process.argv[2];
  // Assert language is valid
  if (!languagesAllowed[langInput.toLowerCase()]) {
    throw new Error(
      `Language ${langInput} is not allowed. Allowed languages: ${Object.keys(
        languagesAllowed
      ).join(', ')}`
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
