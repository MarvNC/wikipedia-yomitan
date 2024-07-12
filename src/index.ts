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
const OUT_DIRECTORY = './out';

(async () => {
  const dev = process.env.NODE_ENV === 'dev';
  const version = await getVersion();

  console.log(`Using version ${version}`);

  const { lang, date } = readArgs();

  console.log(`Converting ${lang} Wikipedia dump from ${date}...`);

  const filePath = await downloadDumps(lang, date);

  const dict = new Dictionary({
    // @ts-ignore
    fileName: outputZipName(lang, date, version),
  });

  const processedLines = await readAndProcessLines(filePath, dict, lang, dev);

  console.log(`Processed ${processedLines} lines, exporting zip...`);

  await dict.setIndex({
    title: `${lang.toUpperCase()} Wikipedia [${date}] (v${version})`,
    revision: `wikipedia_${version}`,
    format: 3,
    url: 'https://github.com/MarvNC/wikipedia-yomitan',
    description: `Wikipedia short abstracts from the DBPedia dataset available at https://databus.dbpedia.org/dbpedia/text/short-abstracts.`,
    author: 'Marv',
    attribution: `https://${lang.toLowerCase()}.wikipedia.org/`,
  });

  await dict.export(OUT_DIRECTORY);
  console.log(`Exported to ${outputZipName(lang, date, version)}`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
});

async function readAndProcessLines(
  filePath: string,
  dict: Dictionary,
  lang: string,
  dev: boolean
) {
  const fileHandle = file(filePath);
  const fileReader = fileHandle.stream();
  const lineReader = fileReader.getReader();
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

      if (processedLines >= 1000 && dev) {
        return processedLines;
      }
    }
  }

  progressBar.stop();
  return processedLines;
}
