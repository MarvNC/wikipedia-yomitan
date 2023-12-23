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
 * @typedef {Object} TestCases
 * @property {typeof languagesAllowed[keyof typeof languagesAllowed]} lang
 * @property {TestCase[]} cases
 */

/**
 * @type {TestCases[]}
 */
const testCases = [
  {
    lang: languagesAllowed.ja,
    cases: [
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
      {
        line: `<http://ja.dbpedia.org/resource/ベンジー郡_(ミシガン州)> <http://www.w3.org/2000/01/rdf-schema#comment> "ベンジー郡（英: Benzie County）は、アメリカ合衆国ミシガン州ロウアー半島の北西部に位置する郡である。2010年国勢調査での人口は17,525人であり、2000年の15,998人から9.5%増加した。郡庁所在地はビューラ村（人口342人）であり、同郡で人口最大の都市は（人口1,286人）である。 ベンジー郡トラバースシティ小都市圏に属している。 「ベンジー」という名前は「アイサカモの川」を意味するフランス語 \"Riviere Aux-Bec Scies\" から派生したものである。アメリカ人開拓者が川の名前の発音を変えて「ベッツィー川」と呼ぶようになった。同様な発音の訛りで「ベンジー」が生まれた。ベンジー郡は当初1864年に設立され、1869年に組織化された。"@ja .`,
        term: 'ベンジー郡',
        expectedReading: '',
      },
      {
        line: `<http://ja.dbpedia.org/resource/沼津中央病院> <http://www.w3.org/2000/01/rdf-schema#comment> "公益財団法人復康会沼津中央病院（こうえきざいだんほうじんふっこうかいぬまづちゅうおうびょういん）は静岡県沼津市にある精神科病院。静岡県東部初の精神科病院として1926年（大正15年）に開院。1945年（昭和20年）7月の沼津大空襲により全施設が焼失し休院。1949年（昭和24年）5月に再建された。2003年(平成15年)1月には全国で3番目となる精神科救急入院料病棟を設置するなど静岡県東部の中心的な精神科病院である。"@ja .`,
        term: '沼津中央病院',
        expectedReading:
          'こうえきざいだんほうじんふっこうかいぬまづちゅうおうびょういん',
      },
      {
        line: `<http://ja.dbpedia.org/resource/Hagenuk_MT-2000> <http://www.w3.org/2000/01/rdf-schema#comment> "Hagenuk MT-2000は1994年に発売された携帯電話である。この端末はデンマークStøvringにあるHagenukの開発センターで設計・製造された。この端末は前身である1992年のHagenuk MT-900とともに (en) の機能を導入した最初期の携帯電話製品の一つである。また、MT-2000は従来の外付けアンテナではなく内蔵アンテナを組み込んだ世界初の製品でもある。さらに、Hagenuk MT-2000はテトリス系のゲームを組み込んだ世界初の携帯電話でもある。"@ja .`,
        term: 'Hagenuk_MT-2000',
        expectedReading:
          '',
      },
    ],
  },
  {
    lang: languagesAllowed.zh,
    cases: [
      {
        line: `<http://zh.dbpedia.org/resource/!HERO> <http://www.w3.org/2000/01/rdf-schema#comment> "《!HERO》（直译“！英雄”）是一部有关耶稣的。这部歌剧基于“如果耶稣出生在宾夕法尼亚州伯利恒将会怎样？”这个问题。2003年首次巡演后，《!HERO》也通过DVD和CD发行。此歌剧也被写成一部小说三部曲和一系列漫画。"@zh .`,
        term: '!HERO',
        expectedReading: '!HERO',
      },
      {
        line: `<http://zh.dbpedia.org/resource/维基百科> <http://www.w3.org/2000/01/rdf-schema#comment> "維基百科（英語：Wikipedia，i/ˌwɪkɪˈpiːdiə/ 或 i/ˌwɪkiˈpiːdiə/）是维基媒体基金会运营的一个多语言的線上百科全書，并以创建和维护作为开放式协同合作项目，特点是自由內容、自由编辑、自由版权。目前是全球網絡上最大且最受大眾歡迎的参考工具书，名列全球二十大最受歡迎的網站，其在搜尋引擎中排名亦較為靠前。維基百科目前由非營利組織維基媒體基金會負責營運。Wikipedia是混成詞，分别取自於網站核心技術「Wiki」以及英文中百科全書之意的「encyclopedia」。截至2021年初，所有語種的維基百科條目數量達5,500萬。"@zh .`,
        term: '维基百科',
        expectedReading: 'wéijībǎikē',
      },
    ],
  },
];

for (const langTestCases of testCases) {
  for (const testCase of langTestCases.cases) {
    test(`parseLine ${langTestCases.lang}: ${testCase.term}`, (t) => {
      const { reading } = parseLine(testCase.line, langTestCases.lang);
      t.is(reading, testCase.expectedReading);
    });
  }
}
