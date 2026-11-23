// コーヒーインストラクター(1級編・マスター編)対策用の練習問題(オリジナル)。
// 実際の試験問題ではありません。教本・講習会の内容を優先してください。
//
// 問題データは data-*.js にあります。各行は
//   [問題文, 正解, 誤答1, 誤答2, 誤答3, 解説]
// の形式です。選択肢は出題のたびにシャッフルされます。
const QUIZ_TITLE = "コーヒーインストラクター 練習クイズ";

function toQuestions(rows) {
  return rows.map(([question, correct, wrong1, wrong2, wrong3, explanation, map]) => ({
    question,
    choices: [correct, wrong1, wrong2, wrong3],
    answer: 0,
    explanation,
    map // 地図問題のとき、色を付ける国のキー(WORLD_MAP の国名)
  }));
}

const CATEGORIES = [
  { group: "1級編", name: "歴史・文化", questions: toQuestions(QDATA_HISTORY) },
  { group: "1級編", name: "地理", questions: toQuestions(QDATA_GEOGRAPHY) },
  { group: "1級編", name: "栽培・品種", questions: toQuestions(QDATA_CULTIVATION) },
  { group: "1級編", name: "精製・生豆", questions: toQuestions(QDATA_PROCESSING) },
  { group: "1級編", name: "焙煎", questions: toQuestions(QDATA_ROASTING) },
  { group: "1級編", name: "抽出", questions: toQuestions(QDATA_BREWING) },
  { group: "1級編", name: "成分・品質", questions: toQuestions(QDATA_QUALITY) },
  { group: "マスター編", name: "商品設計", questions: toQuestions(QDATA_PRODUCT) },
  { group: "マスター編", name: "生豆鑑定", questions: toQuestions(QDATA_GREENBEAN) },
  { group: "マスター編", name: "品質管理", questions: toQuestions(QDATA_QC) }
];

// 全カテゴリ(1級編+マスター編)からランダムに出題する「模擬テスト」の問題数
const MOCK_TEST_SIZE = 100;
