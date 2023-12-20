const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Dictionary } = require('yomichan-dict-builder');

const languagesAllowed = {
  ja: 'JA',
  zh: 'ZH',
};

const linkCharacter = '⧉';
const outputZipName = (lang) => `[${lang}-${lang} Encyclopedia] ${lang} Wikipedia.zip`;
const shortAbstractFile = (lang) => `short-abstracts_lang=${lang.toLowerCase()}.ttl`;

(async () => {
  const { lang, date } = readArgs();
  console.log(`Converting ${lang} Wikipedia dump from ${date}...`);

  const filePath = path.join(__dirname, shortAbstractFile(lang));
  const fileStream = fs.createReadStream(filePath);
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const dict = new Dictionary({
    // @ts-ignore
    fileName: outputZipName(lang),
  });
  for await (const line of lineReader) {
    await processLine(line, dict, lang);
  }
  const index = {
    title: `JA Wikipedia [${date}]`,
    revision: `wikipedia_${new Date().toISOString()}`,
    format: 3,
    url: 'https://ja.wikipedia.org/',
    description: `Wikipedia short abstracts from the DBPedia dataset available at https://databus.dbpedia.org/dbpedia/text/short-abstracts.

Recommended custom CSS:
div.gloss-sc-div[data-sc-jawiki=red] {
  color: #e5007f;
}

Created with https://github.com/MarvNC/yomichan-dictionaries`,
    author: 'Wikipedians, DBPedia, Marv',
    attribution: 'Wikipedia',
  };
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
  const [resource, definition] = line.split('> <http://www.w3.org/2000/01/rdf-schema#comment> "');
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

  let reading = '';
  if (lang === languagesAllowed.ja) {
    reading = getReadingFromDefinition(definition);
  } else if (lang === languagesAllowed.zh) {

  }

  debugger;
}

/**
 * @param {string} definition
 * @returns {string}
 */
function getReadingFromDefinition(definition) {
  const bracketRegex = /[(（]([^)）]*)/g;
  const bracketMatches = bracketRegex.exec(definition);
  // @ts-ignore
  if (bracketMatches?.length >= 1) {
    // @ts-ignore
    const bracketContent = bracketMatches[1];
    return parseReadingFromBrackets(bracketContent);
  }
  return '';
}

/**
 * @param {string} bracketContent
 * @returns {string}
 */
function parseReadingFromBrackets(bracketContent) {
  if (!bracketContent) return '';

  const commaRegex = /,|、/g;
  const kanjiRegex = /[一-龯]/g;

  const readings = bracketContent.split(commaRegex);

  const noKanji = readings.filter((reading) => !kanjiRegex.test(reading));

  if (noKanji.length > 0) {
    let reading = noKanji[0];
    reading = reading.replace(/ /g, '');
    return reading;
  }

  return '';
}

function readArgs() {
  // Read arguments: node convertWikipedia.js [language] [date of dump]
  const langInput = process.argv[3];
  // Assert language is valid
  if (!languagesAllowed[langInput.toLowerCase()]) {
    throw new Error(
      `Language ${langInput} is not allowed. Allowed languages: ${Object.keys(
        languagesAllowed
      ).join(', ')}`
    );
  }

  const lang = languagesAllowed[langInput.toLowerCase()];

  const dateInput = process.argv[2];
  // Assert date is valid in format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    throw new Error(`Date ${dateInput} is not valid. Format: YYYY-MM-DD`);
  }
  return { lang, date: dateInput };
}
