// 問題データ。ここを編集すれば問題を追加・変更できます。
// category: カテゴリ名 / question: 問題文 / choices: 選択肢 /
// answer: 正解の選択肢の番号(0始まり) / explanation: 解説
const CATEGORIES = [
  {
    name: "地理",
    questions: [
      {
        question: "日本で一番面積が大きい都道府県は?",
        choices: ["北海道", "岩手県", "長野県", "福島県"],
        answer: 0,
        explanation: "北海道は日本の総面積の約2割を占めます。"
      },
      {
        question: "世界で一番面積が大きい国は?",
        choices: ["カナダ", "ロシア", "中国", "アメリカ"],
        answer: 1,
        explanation: "ロシアは約1,700万km²で、世界最大です。"
      },
      {
        question: "日本で一番長い川は?",
        choices: ["利根川", "石狩川", "信濃川", "木曽川"],
        answer: 2,
        explanation: "信濃川(千曲川を含む)は全長367kmで日本一です。"
      }
    ]
  },
  {
    name: "理科",
    questions: [
      {
        question: "水が沸騰する温度は、標準的な気圧のもとで何℃?",
        choices: ["80℃", "90℃", "100℃", "120℃"],
        answer: 2,
        explanation: "1気圧では水は100℃で沸騰します。"
      },
      {
        question: "太陽系で一番大きい惑星は?",
        choices: ["土星", "木星", "天王星", "海王星"],
        answer: 1,
        explanation: "木星は太陽系最大の惑星です。"
      },
      {
        question: "植物が光合成で取り込む気体は?",
        choices: ["酸素", "窒素", "二酸化炭素", "水素"],
        answer: 2,
        explanation: "光合成では二酸化炭素と水から、養分と酸素を作ります。"
      }
    ]
  },
  {
    name: "歴史",
    questions: [
      {
        question: "江戸幕府を開いた人物は?",
        choices: ["織田信長", "豊臣秀吉", "徳川家康", "源頼朝"],
        answer: 2,
        explanation: "徳川家康が1603年に江戸幕府を開きました。"
      },
      {
        question: "鎌倉幕府を開いた人物は?",
        choices: ["足利尊氏", "源頼朝", "平清盛", "北条時宗"],
        answer: 1,
        explanation: "源頼朝が鎌倉に武家政権を築きました。"
      },
      {
        question: "「大化の改新」を中心になって進めた人物の組み合わせは?",
        choices: [
          "中大兄皇子と中臣鎌足",
          "聖徳太子と蘇我馬子",
          "天智天皇と持統天皇",
          "藤原道長と藤原頼通"
        ],
        answer: 0,
        explanation: "645年、中大兄皇子と中臣鎌足が蘇我氏を倒しました。"
      }
    ]
  }
];
