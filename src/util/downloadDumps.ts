import { write } from 'bun';
import { exists, mkdir } from 'node:fs/promises';
import { join } from 'path';
import { LanguageCode } from '../constants';
const inly = require('inly');

const ARCHIVE = (lang: string) =>
  `short-abstracts_lang=${lang.toLowerCase()}.ttl.bz2`;
const FILE = (lang: string) => `short-abstracts_lang=${lang.toLowerCase()}.ttl`;
const URL = (lang: string, date: string) =>
  `https://databus.dbpedia.org/dbpedia/text/short-abstracts/${date}/${ARCHIVE(
    lang
  )}`;
const DOWNLOAD_DIR = './download';

export async function downloadDumps(lang: LanguageCode, date: string) {
  // Replace - with . in date
  date = date.replace(/-/g, '.');
  // Check if date is in format YYYY.MM.DD
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: ${date}`);
  }

  // Check if download directory exists
  if (!(await exists(DOWNLOAD_DIR))) {
    console.log(`[${lang}]: Creating download directory ${DOWNLOAD_DIR}`);
    await mkdir(DOWNLOAD_DIR);
  }

  const archivePath = join(DOWNLOAD_DIR, ARCHIVE(lang));
  const filePath = join(DOWNLOAD_DIR, FILE(lang));
  const archiveExists = await exists(archivePath);
  const fileExists = await exists(filePath);
  console.log(
    `[${lang}]: archiveExists=${archiveExists}, fileExists=${fileExists}`
  );

  // Download the archive if neither the file nor archive exists
  if (!fileExists && !archiveExists) {
    const url = URL(lang, date);
    console.log(`[${lang}]: Downloading ${url}`);
    // await $`wget ${url} -O ${archivePath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[${lang}]: Failed to download ${url}: ${response.statusText}`);
    }
    await write(archivePath, await response.arrayBuffer());
  }

  // Extract the archive if it does not exist
  if (!fileExists) {
    console.log(`[${lang}]: Extracting ${archivePath}`);
    const extract = inly(archivePath, DOWNLOAD_DIR);
    await new Promise((resolve, reject) => {
      extract.on('error', reject);
      extract.on('end', resolve);
    });
  }

  console.log(`[${lang}]: Finished downloading and extracting ${lang} dump`);

  return filePath;
}
