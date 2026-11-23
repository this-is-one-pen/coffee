// 白猫の成長ステージ。正解数(min)に達するたびに、次のステージへ成長します(10問刻み)。
// 画像は images/ フォルダに置きます。ファイルがない場合は「画像準備中」と表示されます。
const GROWTH_STAGES = [
  { min: 0, name: "生まれて間もない子猫", image: "images/stage1.jpg" },
  { min: 10, name: "小さな子猫", image: "images/stage2.jpg" },
  { min: 20, name: "やんちゃな子猫", image: "images/stage3.jpg" },
  { min: 30, name: "若い猫", image: "images/stage4.jpg" },
  { min: 40, name: "ほぼ大人の猫", image: "images/stage5.jpg" },
  { min: 50, name: "大人の猫", image: "images/stage6.jpg" },
  { min: 60, name: "立ち上がる猫", image: "images/stage7.jpg" },
  { min: 70, name: "二足歩行する猫", image: "images/stage8.jpg" },
  { min: 80, name: "エプロン姿の猫", image: "images/stage9.jpg" },
  { min: 90, name: "カフェでくつろぐ猫", image: "images/stage10.jpg" }
];
