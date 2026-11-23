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
  const buttons = CATEGORIES.map((cat) => {
    const record = best[cat.name];
    const label = record
      ? `${cat.name}(ベスト ${record.score}/${record.total})`
      : cat.name;
    return el("button", { class: "btn", text: label, onclick: () => startQuiz(cat) });
  });
  const all = el("button", {
    class: "btn",
    text: "すべてのカテゴリからランダム",
    onclick: () =>
      startQuiz({
        name: "ランダム",
        questions: CATEGORIES.flatMap((c) => c.questions)
      })
  });

  render(
    el("div", { class: "card" }, [
      el("h1", { text: "学習クイズ" }),
      el("p", { class: "muted", text: "カテゴリを選んでスタート!" }),
      ...buttons,
      all
    ])
  );
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
  const choiceButtons = q.choices.map((text, i) =>
    el("button", { class: "btn", text, onclick: () => answer(i) })
  );

  function answer(chosen) {
    const correct = chosen === q.answer;
    if (correct) state.score++;
    else state.wrong.push({ q, chosen });

    choiceButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
    });

    const isLast = index === questions.length - 1;
    feedbackBox.replaceChildren(
      el("div", { class: `feedback ${correct ? "ok" : "ng"}` }, [
        el("strong", { text: correct ? "正解!" : "不正解…" }),
        el("p", { text: q.explanation })
      ]),
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
      progress,
      el("p", {
        class: "muted",
        text: `${state.category.name} ・ ${index + 1} / ${questions.length}`
      }),
      el("h2", { text: q.question }),
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
    el("div", { class: "score", text: `${state.score} / ${total}` })
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
