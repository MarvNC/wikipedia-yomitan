import test from 'node:test';
import assert from 'node:assert';

import { parseLine } from './parseLine.js';

/**
 * @typedef {Object} TestCase
 * @property {string} term
 * @property {string} line
 * @property {string} expectedReading
 */
/**
 * @type {TestCase[]}
 */
const jaTestCases = [
  {
    term: 'みぞおち',
    line: `<http://ja.dbpedia.org/resource/みぞおち> <http://www.w3.org/2000/01/rdf-schema#comment> "みぞおちとは、人間の腹の上方中央にある窪んだ部位のこと。鳩尾（きゅうび、みぞおち）、水月（すいげつ）、心窩（しんか、しんわ）とも呼ばれる。みぞおちの内部背中側には腹腔神経叢（ふっくうしんけいそう、英：celiac plexus, solar plexus. 独:solarplexus）という (en:nerve plexus) がある。"@ja .`,
    expectedReading: '',
  },
  {
    term: 'The_20th_Anniversary_Edition_1980-1999_his_words_and_music',
    line: `<http://ja.dbpedia.org/resource/The_20th_Anniversary_Edition_1980-1999_his_words_and_music> <http://www.w3.org/2000/01/rdf-schema#comment> "『The 20th Anniversary Edition 1980-1999 his words and music』（ザ・トゥエンティース・アニバーサリー・エディション 1980-1999 ヒズ・ワーズ・アンド・ミュージック）は、2000年1月21日にEpic Records / M's Factoryから発売された佐野元春のベスト・アルバム。"@ja .`,
    expectedReading:
      'ザ・トゥエンティース・アニバーサリー・エディション 1980-1999 ヒズ・ワーズ・アンド・ミュージック',
  },
  {
    term: 'みずしな孝之',
    line: `<http://ja.dbpedia.org/resource/みずしな孝之> <http://www.w3.org/2000/01/rdf-schema#comment> "みずしな 孝之（みずしな たかゆき、1973年7月10日 - ）は、日本の漫画家、舞台俳優。東京都大田区大森地区生まれ、板橋区出身。男性。本名は水科 孝之（読み同じ、役者時は本名を使用）。"@ja .`,
    expectedReading: 'みずしな たかゆき',
  },
];

for (const testCase of jaTestCases) {
  test(`parseLine ja: ${testCase.line}`, () => {
    const { reading } = parseLine(testCase.line, 'ja');
    assert.strictEqual(reading, testCase.expectedReading);
  });
}
