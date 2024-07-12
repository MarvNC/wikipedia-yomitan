/**
 * This file is used to generate the release notes for the GitHub release.
 * It makes a table of all the languages and a download link for each.
 */

import { write } from 'bun';
import { LANGUAGE_CODES, languageUtils } from './constants';
import { getVersion } from './util/getVersion';
// read directory
import { readdir } from 'node:fs/promises';

const EXPORT_FILE = './release.md';

const version = process.argv[2] ?? (await getVersion());
let md = `## Download
| Language | Download |
| --- | --- |
`;

const files = await readdir('./out');
files.sort((a, b) => {
  const langA = languageUtils[a.substring(0, 2).toLowerCase()];
  const langB = languageUtils[b.substring(0, 2).toLowerCase()];
  return langA.fullName.localeCompare(langB.fullName);
});

for (const file of files) {
  const lang = languageUtils[file.substring(0, 2).toLowerCase()];
  const fileCleanName = file.replace(/[ \[\]\(\)]+/g, '.').replace(/\.+/g, '.');
  md += `| ${lang.fullName} (${lang.nativeName}) | [Download](https://github.com/MarvNC/wikipedia-yomitan/releases/download/${version}/${fileCleanName}) |\n`;
}

// Export
await write(EXPORT_FILE, md);
