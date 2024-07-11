const leewayAfterTerm = 2;

function getReadingFromDefinition(definition: string, term: string): string {
  const normalizeText = (text: string) => text.replace(/ /g, '').toLowerCase();
  // Remove spaces from definition and term
  definition = normalizeText(definition);
  term = normalizeText(term);
  const bracketRegex = /([(（]([^)）]*)[)）])/g;
  const bracketMatches = definition.matchAll(bracketRegex) ?? [];

  for (const matchArr of bracketMatches) {
    if (matchArr && matchArr.length >= 3) {
      const outerBracketContent = matchArr[1];
      const bracketContent = matchArr[2];
      const bracketIndex = definition.indexOf(outerBracketContent);
      const termIndex = definition.indexOf(term) ?? 0;
      const termEndIndex = termIndex + term.length;
      // If the bracket is not at the beginning of the definition or closely following the term, ignore it
      if (bracketIndex - termEndIndex > leewayAfterTerm) {
        continue;
      }
      // If the bracket is within the term or before the term, ignore it
      if (bracketIndex < termEndIndex) {
        continue;
      }
      return parseReadingFromBrackets(bracketContent, term);
    }
  }
  return '';
}

function parseReadingFromBrackets(
  bracketContent: string,
  term: string
): string {
  if (!bracketContent) return '';

  const commaRegex = /,|、/g;
  const kanjiRegex = /[一-龯]/g;

  const readings = bracketContent.split(commaRegex);

  const noKanji = readings.filter((reading) => !reading.match(kanjiRegex));

  const latinRegex = /[a-zA-Z]/g;
  const termHasLatin = term.match(latinRegex);

  let readingCandidates = termHasLatin
    ? noKanji
    : noKanji.filter((reading) => !reading.match(latinRegex));

  const numberRegex = /\d/g;
  const termHasNumber = term.match(numberRegex);

  readingCandidates = termHasNumber
    ? readingCandidates
    : readingCandidates.filter((reading) => !reading.match(numberRegex));

  if (readingCandidates.length > 0) {
    let reading = readingCandidates[0];
    reading = reading.replace(/ /g, '');
    return reading;
  }

  return '';
}

export { getReadingFromDefinition, parseReadingFromBrackets };
