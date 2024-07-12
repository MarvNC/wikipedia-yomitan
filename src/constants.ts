import * as path from 'path';
import { getReadingFromDefinition } from './parse/readingParse';
import { pinyin } from 'pinyin-pro';

export const LANGUAGE_CODES = [
  'hu',
  'eu',
  'pt',
  'ga',
  'el',
  'de',
  'eo',
  'ar',
  'id',
  'pl',
  'cs',
  'ca',
  'sv',
  'ru',
  'nl',
  'uk',
  'en',
  'ko',
  'es',
  'ja',
  'zh',
  'fr',
  'it',
] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const languageUtils: {
  [key: string]: {
    getReading: (definition: string, term: string) => string;
    fullName: string;
  };
} = {
  hu: {
    getReading: (definition, term) => '',
    fullName: 'Hungarian',
  },
  eu: {
    getReading: (definition, term) => '',
    fullName: 'Basque',
  },
  pt: {
    getReading: (definition, term) => '',
    fullName: 'Portuguese',
  },
  ga: {
    getReading: (definition, term) => '',
    fullName: 'Irish',
  },
  el: {
    getReading: (definition, term) => '',
    fullName: 'Greek',
  },
  de: {
    getReading: (definition, term) => '',
    fullName: 'German',
  },
  eo: {
    getReading: (definition, term) => '',
    fullName: 'Esperanto',
  },
  ar: {
    getReading: (definition, term) => '',
    fullName: 'Arabic',
  },
  id: {
    getReading: (definition, term) => '',
    fullName: 'Indonesian',
  },
  pl: {
    getReading: (definition, term) => '',
    fullName: 'Polish',
  },
  cs: {
    getReading: (definition, term) => '',
    fullName: 'Czech',
  },
  ca: {
    getReading: (definition, term) => '',
    fullName: 'Catalan',
  },
  sv: {
    getReading: (definition, term) => '',
    fullName: 'Swedish',
  },
  ru: {
    getReading: (definition, term) => '',
    fullName: 'Russian',
  },
  nl: {
    getReading: (definition, term) => '',
    fullName: 'Dutch',
  },
  uk: {
    getReading: (definition, term) => '',
    fullName: 'Ukrainian',
  },
  en: {
    getReading: (definition, term) => '',
    fullName: 'English',
  },
  ko: {
    getReading: (definition, term) => '',
    fullName: 'Korean',
  },
  es: {
    getReading: (definition, term) => '',
    fullName: 'Spanish',
  },
  ja: {
    getReading: (definition, term) =>
      getReadingFromDefinition(definition, term),
    fullName: 'Japanese',
  },
  zh: {
    getReading: (definition, term) =>
      pinyin(term, { mode: 'surname' }).replace(/ /g, ''),
    fullName: 'Chinese',
  },
  fr: {
    getReading: (definition, term) => '',
    fullName: 'French',
  },
  it: {
    getReading: (definition, term) => '',
    fullName: 'Italian',
  },
};

export const ASSETS_FOLDER = './assets';
export const WIKIPEDIA_ICON_FILENAME = 'wikipedia-icon.png';
export const WIKIPEDIA_ICON_FILEPATH = path.join(
  ASSETS_FOLDER,
  WIKIPEDIA_ICON_FILENAME
);
