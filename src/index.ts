import { file } from 'bun';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';

import { parseLine } from './parse/parseLine';
import { languages, linkCharacter } from './constants';
import { getVersion } from './util/getVersion';
import type {
  StructuredContent,
  StructuredContentNode,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';

import * as cliProgress from 'cli-progress';
import { downloadDumps } from './util/downloadDumps';
import { readArgs } from './util/readArgs';
import { processLine } from './yomitan/processLine';

const outputZipName = (lang: string, date: string, version: string) =>
  `${lang} Wikipedia [${date}] (v${version}).zip`;

(async () => {
  const version = await getVersion();

  console.log(`Using version ${version}`);

  const { lang, date } = readArgs();

  console.log(`Converting ${lang} Wikipedia dump from ${date}...`);

  const filePath = await downloadDumps(lang, date);
  const fileHandle = file(filePath);
  const fileReader = fileHandle.stream();
  const lineReader = fileReader.getReader();

  const dict = new Dictionary({
    // @ts-ignore
    fileName: outputZipName(lang, date, version),
  });

  let processedLines = 0;
  let buffer = '';
  const progressBar = new cliProgress.SingleBar({
    format: `{value} lines | {file}`,
  });

  progressBar.start(0, 0, {
    file: filePath,
  });

  while (true) {
    const { done, value } = await lineReader.read();
    if (done) break;

    buffer += new TextDecoder().decode(value);
    let lineEnd;

    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEnd);

      processLine(line.trim(), dict, lang);

      buffer = buffer.slice(lineEnd + 1);
      processedLines++;

      progressBar.update(processedLines);
    }
  }

  progressBar.stop();

  console.log(`Processed ${processedLines} lines, exporting zip...`);

  await dict.setIndex({
    title: `${lang.toUpperCase()} Wikipedia [${date}] (v${version})`,
    revision: `wikipedia_${version}`,
    format: 3,
    url: 'https://github.com/MarvNC/wikipedia-yomitan',
    description: `Wikipedia short abstracts from the DBPedia dataset available at https://databus.dbpedia.org/dbpedia/text/short-abstracts.

Recommended custom CSS:
div.gloss-sc-div[data-sc-wikipedia=term-specifier] {
  color: #e5007f;
}`,
    author: 'Wikipedians, DBPedia, Marv',
    attribution: `https://${lang.toLowerCase()}.wikipedia.org/`,
  });

  await dict.export('./');
  console.log(`Exported to ${outputZipName(lang, date, version)}`);
})().catch((e) => {
  console.error(e);
});
