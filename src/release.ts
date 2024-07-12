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

const version = await getVersion();
let md = `# Download
| Language | Download |
| --- | --- |
`;

const files = await readdir('./out');
for (const file of files) {
  const lang = languageUtils[file.substring(0, 2).toLowerCase()];
  md += `| ${
    lang.fullName
  } | [Download](https://github.com/MarvNC/wikipedia-yomitan/releases/latest/download/${file.replace(
    / /g,
    '.'
  )}) |\n`;
}

// Export
await write(EXPORT_FILE, md);
