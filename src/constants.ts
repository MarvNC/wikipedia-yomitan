import * as path from 'path';
import { getReadingFromDefinition } from './parse/readingParse';
import { pinyin } from 'pinyin-pro';

export const DBPEDIA_DATE = '2022-12-01';

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
    nativeName: string;
  };
} = {
  hu: {
    getReading: (definition, term) => '',
    fullName: 'Hungarian',
    nativeName: 'Magyar',
  },
  eu: {
    getReading: (definition, term) => '',
    fullName: 'Basque',
    nativeName: 'Euskara',
  },
  pt: {
    getReading: (definition, term) => '',
    fullName: 'Portuguese',
    nativeName: 'Português',
  },
  ga: {
    getReading: (definition, term) => '',
    fullName: 'Irish',
    nativeName: 'Gaeilge',
  },
  el: {
    getReading: (definition, term) => '',
    fullName: 'Greek',
    nativeName: 'Ελληνικά',
  },
  de: {
    getReading: (definition, term) => '',
    fullName: 'German',
    nativeName: 'Deutsch',
  },
  eo: {
    getReading: (definition, term) => '',
    fullName: 'Esperanto',
    nativeName: 'Esperanto',
  },
  ar: {
    getReading: (definition, term) => '',
    fullName: 'Arabic',
    nativeName: 'العربية',
  },
  id: {
    getReading: (definition, term) => '',
    fullName: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
  },
  pl: {
    getReading: (definition, term) => '',
    fullName: 'Polish',
    nativeName: 'Polski',
  },
  cs: {
    getReading: (definition, term) => '',
    fullName: 'Czech',
    nativeName: 'Čeština',
  },
  ca: {
    getReading: (definition, term) => '',
    fullName: 'Catalan',
    nativeName: 'Català',
  },
  sv: {
    getReading: (definition, term) => '',
    fullName: 'Swedish',
    nativeName: 'Svenska',
  },
  ru: {
    getReading: (definition, term) => '',
    fullName: 'Russian',
    nativeName: 'Русский',
  },
  nl: {
    getReading: (definition, term) => '',
    fullName: 'Dutch',
    nativeName: 'Nederlands',
  },
  uk: {
    getReading: (definition, term) => '',
    fullName: 'Ukrainian',
    nativeName: 'Українська',
  },
  en: {
    getReading: (definition, term) => '',
    fullName: 'English',
    nativeName: 'English',
  },
  ko: {
    getReading: (definition, term) => '',
    fullName: 'Korean',
    nativeName: '한국어',
  },
  es: {
    getReading: (definition, term) => '',
    fullName: 'Spanish',
    nativeName: 'Español',
  },
  ja: {
    getReading: (definition, term) =>
      getReadingFromDefinition(definition, term),
    fullName: 'Japanese',
    nativeName: '日本語',
  },
  zh: {
    getReading: (definition, term) =>
      pinyin(term, { mode: 'surname' }).replace(/ /g, ''),
    fullName: 'Chinese',
    nativeName: '中文',
  },
  fr: {
    getReading: (definition, term) => '',
    fullName: 'French',
    nativeName: 'Français',
  },
  it: {
    getReading: (definition, term) => '',
    fullName: 'Italian',
    nativeName: 'Italiano',
  },
};

export const ASSETS_FOLDER = './assets';
export const WIKIPEDIA_ICON_FILENAME = 'wikipedia-icon.png';
export const WIKIPEDIA_ICON_FILEPATH = path.join(
  ASSETS_FOLDER,
  WIKIPEDIA_ICON_FILENAME
);
