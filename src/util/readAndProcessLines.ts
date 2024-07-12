import { file } from 'bun';
import { Dictionary } from 'yomichan-dict-builder';
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

      if (processedLines >= 1000 && dev) {
        return processedLines;
      }

      if (processedLines % 10000 === 0) {
        console.log(
          `[${lang}] ${new Date()
            .toTimeString()
            .slice(0, 8)}: Processed ${processedLines} lines`
        );
      }
    }
  }
  return processedLines;
}
