import { pinyin } from 'pinyin-pro';
import { languages } from '../constants';
import { getReadingFromDefinition } from './readingParse';

type ParsedLine = {
  term: string;
  termSlug: string;
  termSpecifier: string;
  reading: string;
  definition: string;
};

/**
 * Parses a line of text and extracts relevant information.
 */
function parseLine(
  line: string,
  lang: (typeof languages)[keyof typeof languages]
): ParsedLine {
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

  let reading = '';
  if (lang === languages.ja) {
    reading = getReadingFromDefinition(definition, term);
  } else if (lang === languages.zh) {
    reading = pinyin(term, { mode: 'surname' });
    reading = reading.replace(/ /g, '');
  }

  return {
    term,
    termSlug,
    termSpecifier,
    reading,
    definition,
  };
}

export { parseLine };
