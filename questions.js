// コーヒーインストラクター1級 対策用の練習問題(オリジナル)。
// 実際の試験問題ではありません。教本・講習会の内容を優先してください。
//
// 問題データは data-*.js にあります。各行は
//   [問題文, 正解, 誤答1, 誤答2, 誤答3, 解説]
// の形式です。選択肢は出題のたびにシャッフルされます。
const QUIZ_TITLE = "コーヒーインストラクター1級 練習クイズ";

function toQuestions(rows) {
  return rows.map(([question, correct, wrong1, wrong2, wrong3, explanation]) => ({
    question,
    choices: [correct, wrong1, wrong2, wrong3],
    answer: 0,
    explanation
  }));
}

const CATEGORIES = [
  { name: "歴史・文化", questions: toQuestions(QDATA_HISTORY) },
  { name: "栽培・品種", questions: toQuestions(QDATA_CULTIVATION) },
  { name: "精製・生豆", questions: toQuestions(QDATA_PROCESSING) },
  { name: "焙煎", questions: toQuestions(QDATA_ROASTING) },
  { name: "抽出", questions: toQuestions(QDATA_BREWING) },
  { name: "成分・品質", questions: toQuestions(QDATA_QUALITY) }
];

// 全カテゴリからランダムに出題する「模擬テスト」の問題数
const MOCK_TEST_SIZE = 100;
