// 白猫の成長ステージ。正解数(min)に達するたびに、次のステージへ成長します。
// 画像は images/ フォルダに置きます。ファイルがない場合は「画像準備中」と表示されます。
const GROWTH_STAGES = [
  { min: 0, name: "子猫", image: "images/stage1.jpg" },
  { min: 10, name: "少し大きくなった猫", image: "images/stage2.jpg" },
  { min: 30, name: "大人の猫", image: "images/stage3.jpg" },
  { min: 60, name: "二足歩行する猫", image: "images/stage4.jpg" },
  { min: 90, name: "カフェでくつろぐ猫", image: "images/stage5.jpg" }
];
