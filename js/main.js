// =========================
// 生徒マスター（退塾管理）
// =========================
let STUDENTS = {
  "1001": { name: "田中", active: true },
  "1002": { name: "佐藤", active: true },
  "1003": { name: "鈴木", active: true }
};

// =========================
// 学習データ
// =========================
const DATA = [
  { prompt: "apple", answer: "りんご" },
  { prompt: "book", answer: "本" },
  { prompt: "cat", answer: "猫" },
  { prompt: "dog", answer: "犬" }
];

// =========================
// 状態
// =========================
let studentId = null;
let CURRENT = [];
let index = 0;
let timer = null;
let timeLeft = 0;

// =========================
// ログイン
// =========================
function login() {

  const id = document.getElementById("studentId").value.trim();
  const s = STUDENTS[id];

  if (!s || !s.active) {
    alert("このIDは無効です");
    return;
  }

  studentId = id;

  document.getElementById("loginMsg").innerText =
    `ログイン中：${s.name}`;
}

// =========================
// 受動学習（流し）
// =========================
function startPassive() {

  CURRENT = [...DATA];
  index = 0;

  showPassive();
}

function showPassive() {

  if (index >= CURRENT.length) {
    document.getElementById("output").innerHTML = "終了";
    return;
  }

  const q = CURRENT[index];

  document.getElementById("output").innerHTML = `
    <h2>${q.prompt}</h2>
    <p>→ ${q.answer}</p>
  `;

  setTimeout(() => {
    index++;
    showPassive();
  }, 2500);
}

// =========================
// 能動テスト
// =========================
function startTest() {

  if (!studentId) return alert("ログインしてね");

  CURRENT = shuffle([...DATA]);
  index = 0;

  showQuestion();
}

function showQuestion() {

  if (index >= CURRENT.length) {
    document.getElementById("output").innerHTML = "終了";
    return;
  }

  const q = CURRENT[index];

  document.getElementById("output").innerHTML = `
    <h2>${q.prompt}</h2>
    <div id="answer"></div>
  `;

  startTimer(q);
}

// =========================
// タイマー（1〜10秒）
// =========================
function startTimer(q) {

  clearInterval(timer);

  timeLeft = 5;

  timer = setInterval(() => {

    timeLeft--;

    document.getElementById("timer").innerText =
      `残り：${timeLeft}秒`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      reveal(q);
    }

  }, 1000);
}

function reveal(q) {

  document.getElementById("answer").innerText =
    `正解：${q.answer}`;

  setTimeout(() => {
    index++;
    showQuestion();
  }, 1200);
}

// =========================
// PDF出力
// =========================
function exportPDF() {

  let html = "<h1>問題一覧</h1><hr>";

  CURRENT.forEach((q, i) => {
    html += `
      <div>
        ${i + 1}. ${q.prompt}<br>
        答え：${q.answer}
        <hr>
      </div>
    `;
  });

  const w = window.open("", "_blank");
  w.document.write(`<body onload="window.print()">${html}</body>`);
  w.document.close();
}

// =========================
// 生徒追加
// =========================
function addStudent() {

  const id = document.getElementById("newId").value;
  const name = document.getElementById("newName").value;

  STUDENTS[id] = { name, active: true };

  renderStudents();
}

// =========================
// 一覧
// =========================
function renderStudents() {

  document.getElementById("studentList").innerHTML =
    Object.entries(STUDENTS).map(([id, s]) => `
      <div>
        ${id} ${s.name}
        ${s.active ? "🟢" : "🔴"}
      </div>
    `).join("");
}

// =========================
// シャッフル
// =========================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 初期表示
renderStudents();