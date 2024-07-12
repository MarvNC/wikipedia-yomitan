import { Dictionary } from 'yomichan-dict-builder';

import { getVersion } from './util/getVersion';

import { downloadDumps } from './util/downloadDumps';
import { readArgs } from './util/readArgs';
import { readAndProcessLines } from './util/readAndProcessLines';

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
