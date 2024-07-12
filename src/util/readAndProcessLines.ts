import { file } from 'bun';
import { Dictionary } from 'yomichan-dict-builder';
import * as cliProgress from 'cli-progress';
import { processLine } from '../yomitan/processLine';
import { LanguageCode } from '../constants';

export async function readAndProcessLines(
  filePath: string,
  dict: Dictionary,
  lang: LanguageCode,
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
