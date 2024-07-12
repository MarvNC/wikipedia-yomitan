import * as path from 'path';
import { getReadingFromDefinition } from './parse/readingParse';
import { pinyin } from 'pinyin-pro';

export const LANGUAGE_CODES = ['ja', 'zh'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const languageUtils: {
  [key in LanguageCode]: {
    getReading: (definition: string, term: string) => string;
  };
} = {
  ja: {
    getReading: (definition, term) =>
      getReadingFromDefinition(definition, term),
  },
  zh: {
    getReading: (definition, term) =>
      pinyin(term, { mode: 'surname' }).replace(/ /g, ''),
  },
};

export const ASSETS_FOLDER = './assets';
export const WIKIPEDIA_ICON_FILENAME = 'wikipedia-icon.png';
export const WIKIPEDIA_ICON_FILEPATH = path.join(
  ASSETS_FOLDER,
  WIKIPEDIA_ICON_FILENAME
);
