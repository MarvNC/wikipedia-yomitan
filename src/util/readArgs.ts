import { parseArgs } from "util";
import { languages } from "../constants";

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

  const langInput = (
    values.lang as string
  )?.toLowerCase() as keyof typeof languages;
  const dateInput = values.date as string;

  // Assert language is valid
  if (!langInput || !languages[langInput]) {
    throw new Error(
      `Language ${langInput} is not allowed or not provided. Allowed languages: ${Object.keys(
        languages
      ).join(', ')}`
    );
  }

  const lang = languages[langInput] as keyof typeof languages;

  // Assert date is valid in format YYYY-MM-DD
  if (!dateInput || !/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    throw new Error(
      `Date ${dateInput} is not valid or not provided. Format: YYYY-MM-DD`
    );
  }

  return { lang, date: dateInput };
}
