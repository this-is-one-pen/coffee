"use strict";

// ---- ユーティリティ ----
const app = document.getElementById("app");
const STORAGE_KEY = "quiz-best-scores";

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveBest(category, score, total) {
  try {
    const best = loadBest();
    const prev = best[category];
    if (!prev || score / total > prev.score / prev.total) {
      best[category] = { score, total };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
    }
  } catch (e) {
    // 保存できない環境では記録なしで続行する
  }
}

// 要素を作る小さなヘルパー。文字列は textContent で入れるので安全。
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) node.append(child);
  return node;
}

function render(node) {
  app.replaceChildren(node);
}

// ---- 画面: カテゴリ選択 ----
function showMenu() {
  const best = loadBest();
  const buttons = [];
  let lastGroup = null;
  CATEGORIES.forEach((cat) => {
    if (cat.group && cat.group !== lastGroup) {
      buttons.push(el("h2", { class: "group-title", text: cat.group }));
      lastGroup = cat.group;
    }
    const record = best[cat.name];
    const base = `${cat.name}(${cat.questions.length}問)`;
    const label = record ? `${base} ベスト ${record.score}/${record.total}` : base;
    buttons.push(el("button", { class: "btn", text: label, onclick: () => startQuiz(cat) }));
  });
  const allQuestions = CATEGORIES.flatMap((c) => c.questions);
  const mockSize = Math.min(MOCK_TEST_SIZE, allQuestions.length);
  const mock = el("button", {
    class: "btn primary",
    text: `模擬テスト(全カテゴリからランダム${mockSize}問)`,
    onclick: () =>
      startQuiz({
        name: "模擬テスト",
        questions: shuffle(allQuestions).slice(0, mockSize)
      })
  });

  render(
    el("div", { class: "card" }, [
      el("h1", { text: QUIZ_TITLE }),
      el("p", { class: "muted", text: "カテゴリを選んでスタート。1問ごとに正解・不正解が表示されます。" }),
      ...buttons,
      mock,
      el("p", {
        class: "notice",
        text: "この問題は、一般的なコーヒーの知識から作ったオリジナルの練習問題です。実際の試験問題ではありません。教本や講習会の内容を優先してください。"
      })
    ])
  );
}

// ---- 世界地図(地図問題) ----
const SVG_NS = "http://www.w3.org/2000/svg";
const mapBoxCache = {};

// 指定した国のパスから、表示すべき範囲(バウンディングボックス)を求める
function countryBox(name) {
  if (mapBoxCache[name]) return mapBoxCache[name];
  const d = WORLD_MAP.countries[name];
  let box = null;
  for (const sub of d.split("M").slice(1)) {
    const nums = sub.replace("Z", "").split("L").map((p) => p.split(" ").map(Number));
    const xs = nums.map((p) => p[0]);
    const ys = nums.map((p) => p[1]);
    const b = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    if (b.x1 <= 0 || b.x0 >= WORLD_MAP.width) continue; // 画面の外にある複製は除く
    box = box
      ? { x0: Math.min(box.x0, b.x0), x1: Math.max(box.x1, b.x1), y0: Math.min(box.y0, b.y0), y1: Math.max(box.y1, b.y1) }
      : b;
  }
  mapBoxCache[name] = box;
  return box;
}

// 対象の国に色を付け、その国の周辺を拡大した世界地図を作る
function buildMap(name) {
  const W = WORLD_MAP.width;
  const H = WORLD_MAP.height;
  const box = countryBox(name);
  const cx = (box.x0 + box.x1) / 2;
  const cy = (box.y0 + box.y1) / 2;
  const w = Math.min(W, Math.max((box.x1 - box.x0) * 2.2, ((box.y1 - box.y0) * 2.2 * W) / H, 240));
  const h = (w * H) / W;
  const x0 = Math.max(0, Math.min(W - w, cx - w / 2));
  const y0 = Math.max(0, Math.min(H - h, cy - h / 2));
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  svg.setAttribute("class", "world-map");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "世界地図。問題の国に色が付いています。");
  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", String(W));
  bg.setAttribute("height", String(H));
  bg.setAttribute("class", "map-sea");
  svg.append(bg);
  for (const [country, d] of Object.entries(WORLD_MAP.countries)) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", country === name ? "map-land map-target" : "map-land");
    svg.append(path);
  }
  return el("div", { class: "map-box" }, [svg]);
}

// ---- 白猫の成長 ----
function stageIndexFor(score) {
  let idx = 0;
  GROWTH_STAGES.forEach((s, i) => {
    if (score >= s.min) idx = i;
  });
  return idx;
}

// 現在の正解数に応じた、猫の画像と一言を表示するパネル。grew=true なら成長を知らせる。
function buildCatPanel(score, grew) {
  const idx = stageIndexFor(score);
  const stage = GROWTH_STAGES[idx];
  const next = GROWTH_STAGES[idx + 1];

  const holder = el("div", { class: "cat-img-box" });
  const placeholder = () =>
    el("div", { class: "cat-placeholder" }, [
      el("div", { class: "cat-emoji", text: "🐱" }),
      el("div", { text: `画像準備中(${stage.image})` })
    ]);
  const img = el("img", { class: "cat-img", src: stage.image, alt: `白猫:${stage.name}` });
  img.addEventListener("error", () => holder.replaceChildren(placeholder()));
  holder.append(img);

  const caption = next
    ? `あと${next.min - score}問正解で「${next.name}」に成長`
    : "最終形態です!";
  const children = [];
  if (grew) {
    children.push(el("div", { class: "grow-banner", text: `🎉 成長しました!「${stage.name}」` }));
  }
  children.push(holder);
  children.push(
    el("p", { class: "cat-caption", text: `${stage.name} ・ 正解 ${score}問 ・ ${caption}` })
  );
  return el("div", { class: "cat-panel" }, children);
}

// ---- 画面: 出題 ----
function startQuiz(category) {
  const questions = shuffle(category.questions).map((q) => {
    // 選択肢をシャッフルしつつ、正解の位置を追跡する
    const order = shuffle(q.choices.map((_, i) => i));
    return {
      ...q,
      choices: order.map((i) => q.choices[i]),
      answer: order.indexOf(q.answer)
    };
  });
  showQuestion({ category, questions, index: 0, score: 0, wrong: [] });
}

function showQuestion(state) {
  const { questions, index } = state;
  const q = questions[index];
  const progress = el("div", { class: "progress" }, [
    el("div", { style: `width:${(index / questions.length) * 100}%` })
  ]);
  const feedbackBox = el("div");
  const catBox = el("div");
  catBox.append(buildCatPanel(state.score, false));
  const choiceButtons = q.choices.map((text, i) =>
    el("button", { class: "btn", text, onclick: () => answer(i) })
  );

  function answer(chosen) {
    const correct = chosen === q.answer;
    const before = stageIndexFor(state.score);
    if (correct) state.score++;
    else state.wrong.push({ q, chosen });
    if (correct) {
      catBox.replaceChildren(buildCatPanel(state.score, stageIndexFor(state.score) > before));
    }

    choiceButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
    });

    const isLast = index === questions.length - 1;
    const feedbackChildren = [
      el("div", { class: "verdict", text: correct ? "⭕ 正解!" : "❌ 不正解" })
    ];
    if (!correct) {
      feedbackChildren.push(el("p", { text: `正解は「${q.choices[q.answer]}」です。` }));
    }
    feedbackChildren.push(el("p", { class: "explain", text: q.explanation }));
    feedbackBox.replaceChildren(
      el("div", { class: `feedback ${correct ? "ok" : "ng"}`, role: "status" }, feedbackChildren),
      el("button", {
        class: "btn primary",
        text: isLast ? "結果を見る" : "次の問題へ",
        onclick: () =>
          isLast ? showResult(state) : showQuestion({ ...state, index: index + 1 })
      })
    );
  }

  render(
    el("div", { class: "card" }, [
      el("button", { class: "link", text: "← やめてメニューに戻る", onclick: showMenu }),
      progress,
      catBox,
      el("p", {
        class: "muted",
        text: `${state.category.name} ・ ${index + 1} / ${questions.length}`
      }),
      el("h2", { text: q.question }),
      ...(q.map ? [buildMap(q.map)] : []),
      ...choiceButtons,
      feedbackBox
    ])
  );
}

// ---- 画面: 結果 ----
function showResult(state) {
  const total = state.questions.length;
  saveBest(state.category.name, state.score, total);

  const children = [
    el("h1", { text: "結果" }),
    el("div", { class: "score", text: `${state.score} / ${total}` }),
    buildCatPanel(state.score, false)
  ];

  if (state.wrong.length > 0) {
    children.push(el("h2", { text: "まちがえた問題" }));
    children.push(
      el(
        "ol",
        { class: "review" },
        state.wrong.map(({ q, chosen }) =>
          el("li", {}, [
            el("div", { text: q.question }),
            el("div", { class: "muted", text: `あなたの答え: ${q.choices[chosen]}` }),
            el("div", { text: `正解: ${q.choices[q.answer]}` }),
            el("div", { class: "muted", text: q.explanation })
          ])
        )
      )
    );
  } else {
    children.push(el("p", { text: "全問正解です!すばらしい!" }));
  }

  children.push(
    el("button", {
      class: "btn primary",
      text: "もう一度挑戦",
      onclick: () => startQuiz(state.category)
    }),
    el("button", { class: "btn primary", text: "カテゴリ選択へ", onclick: showMenu })
  );

  render(el("div", { class: "card" }, children));
}

showMenu();
