const leewayAfterTerm = 2;

/**
 * @param {string} definition
 * @param {string} term
 * @returns {string}
 */
function getReadingFromDefinition(definition, term) {
  // Remove spaces from definition and term
  definition = definition.replace(/ /g, '');
  term = term.replace(/ /g, '');
  const bracketRegex = /([(（]([^)）]*))/g;
  const bracketMatches = bracketRegex.exec(definition);

  if (bracketMatches && bracketMatches.length >= 2) {
    // @ts-ignore
    const outerBracketContent = bracketMatches[1];
    const bracketContent = bracketMatches[2];
    const bracketIndex = definition.indexOf(outerBracketContent);
    const termIndex = definition.indexOf(term) ?? 0;
    const termEndIndex = termIndex + term.length;
    // If the bracket is not at the beginning of the definition or closely following the term, ignore it
    if (bracketIndex - termEndIndex > leewayAfterTerm) {
      return '';
    }
    // If the bracket is within the term or before the term, ignore it
    if (bracketIndex < termIndex) {
      return '';
    }
    return parseReadingFromBrackets(bracketContent, term);
  }
  return '';
}

/**
 * @param {string} bracketContent
 * @param {string} term
 * @returns {string}
 */
function parseReadingFromBrackets(bracketContent, term) {
  if (!bracketContent) return '';

  const commaRegex = /,|、/g;
  const kanjiRegex = /[一-龯]/g;

  const readings = bracketContent.split(commaRegex);

  const noKanji = readings.filter((reading) => !kanjiRegex.test(reading));

  const latinRegex = /[a-zA-Z]/g;
  const termHasLatin = latinRegex.test(term);

  const readingCandidates = termHasLatin
    ? noKanji
    : noKanji.filter((reading) => !latinRegex.test(reading));

  if (readingCandidates.length > 0) {
    let reading = readingCandidates[0];
    reading = reading.replace(/ /g, '');
    return reading;
  }

  return '';
}

export { getReadingFromDefinition, parseReadingFromBrackets };
