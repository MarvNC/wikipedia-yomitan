import { parseArgs } from 'util';
import { LanguageCode, languageUtils } from '../constants';

export function readArgs() {
  const { values } = parseArgs({
    options: {
      lang: {
        type: 'string',
        short: 'l',
      },
      date: {
        type: 'string',
        short: 'd',
      },
    },
    strict: true,
    allowPositionals: false,
  });

  const langInput = (values.lang as string)?.toLowerCase() as LanguageCode;
  const dateInput = values.date as string;

  // Assert language is valid
  if (!langInput || !languageUtils[langInput]) {
    throw new Error(
      `Language ${langInput} is not allowed or not provided. Allowed languages: ${Object.keys(
        languageUtils
      ).join(', ')}`
    );
  }

  // Assert date is valid in format YYYY-MM-DD
  if (!dateInput || !/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    throw new Error(
      `Date ${dateInput} is not valid or not provided. Format: YYYY-MM-DD`
    );
  }

  return { lang: langInput, date: dateInput };
}
