import test from 'ava';

import { parseLine } from './parseLine.js';

import { languagesAllowed } from './constants.js';

/**
 * @typedef {Object} TestCase
 * @property {string} line
 * @property {string} term
 * @property {string} expectedReading
 */
/**
 * @type {TestCase[]}
 */
const jaTestCases = [
  {
    line: `<http://ja.dbpedia.org/resource/みぞおち> <http://www.w3.org/2000/01/rdf-schema#comment> "みぞおちとは、人間の腹の上方中央にある窪んだ部位のこと。鳩尾（きゅうび、みぞおち）、水月（すいげつ）、心窩（しんか、しんわ）とも呼ばれる。みぞおちの内部背中側には腹腔神経叢（ふっくうしんけいそう、英：celiac plexus, solar plexus. 独:solarplexus）という (en:nerve plexus) がある。"@ja .`,
    term: 'みぞおち',
    expectedReading: '',
  },
  {
    line: `<http://ja.dbpedia.org/resource/性的挿入> <http://www.w3.org/2000/01/rdf-schema#comment> "性的挿入（Sexual penetration）は、人間または動物による性行為の一種。膣・肛門・口などの穴に、陰茎を中心とする他の物体を挿入する行為を指す。医学用語や法律用語でもある。"@ja .`,
    term: '性的挿入',
    expectedReading: '',
  },
  {
    line: `<http://ja.dbpedia.org/resource/The_20th_Anniversary_Edition_1980-1999_his_words_and_music> <http://www.w3.org/2000/01/rdf-schema#comment> "『The 20th Anniversary Edition 1980-1999 his words and music』（ザ・トゥエンティース・アニバーサリー・エディション 1980-1999 ヒズ・ワーズ・アンド・ミュージック）は、2000年1月21日にEpic Records / M's Factoryから発売された佐野元春のベスト・アルバム。"@ja .`,
    term: 'The_20th_Anniversary_Edition_1980-1999_his_words_and_music',
    expectedReading:
      'ザ・トゥエンティース・アニバーサリー・エディション1980-1999ヒズ・ワーズ・アンド・ミュージック',
  },
  {
    line: `<http://ja.dbpedia.org/resource/みずしな孝之> <http://www.w3.org/2000/01/rdf-schema#comment> "みずしな 孝之（みずしな たかゆき、1973年7月10日 - ）は、日本の漫画家、舞台俳優。東京都大田区大森地区生まれ、板橋区出身。男性。本名は水科 孝之（読み同じ、役者時は本名を使用）。"@ja .`,
    term: 'みずしな孝之',
    expectedReading: 'みずしなたかゆき',
  },
  {
    line: `<http://ja.dbpedia.org/resource/!!!!!!!!/君という仮説> <http://www.w3.org/2000/01/rdf-schema#comment> "「!!!!!!!!/君という仮説」（ばんばんばん/きみというかせつ）は、2016年10月11日にT-Palette Recordsから発売、および配信された日本の女性アイドルグループ・アップアップガールズ（仮）の通算21枚目のCDシングルである。"@ja .`,
    term: '!!!!!!!!/君という仮説',
    expectedReading: 'ばんばんばん/きみというかせつ',
  },
];

for (const testCase of jaTestCases) {
  test(`parseLine ja: ${testCase.term}`, (t) => {
    const { reading } = parseLine(testCase.line, languagesAllowed.ja);
    t.is(reading, testCase.expectedReading);
  });
}
