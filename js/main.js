let DATA = [];
let CURRENT = [];
let WRONG = [];

let WEAK = {};
let HOMEWORK = [];

let studentId = null;

// =========================
// 初期化
// =========================
window.addEventListener("DOMContentLoaded", () => {

  document.getElementById("loginBtn").addEventListener("click", login);

  document.getElementById("startBtn").addEventListener("click", startTest);

  document.getElementById("homeworkBtn").addEventListener("click", generateHomework);

  loadData();
});

// =========================
// ログイン
// =========================
function login() {

  studentId = document.getElementById("studentId").value;

  if (!studentId) return alert("IDを入力してね");

  const saved = localStorage.getItem(`weak_${studentId}`);
  WEAK = saved ? JSON.parse(saved) : {};

  alert(`ログイン: ${studentId}`);
}

// =========================
// データ取得
// =========================
async function loadData() {

  const subject = document.getElementById("subject").value;

  const res = await fetch(`YOUR_APPS_SCRIPT_URL?sheet=${subject}`);
  const raw = await res.json();

  DATA = raw.map(d => ({
    prompt: d.prompt || d.en,
    answer: d.answer || d.ja,
    subject,
    material: d.material
  }));

  updateMaterials();
}

// =========================
// 教材
// =========================
function updateMaterials() {

  const list = [...new Set(DATA.map(d => d.material))];

  document.getElementById("material").innerHTML =
    list.map(m => `<option value="${m}">${m}</option>`).join("");
}

// =========================
// テスト
// =========================
function startTest() {

  const subject = document.getElementById("subject").value;
  const material = document.getElementById("material").value;

  CURRENT = DATA.filter(d =>
    d.subject === subject &&
    d.material === material
  );

  WRONG = [];

  render();
}

// =========================
// 🧠 宿題生成AI（核心）
// =========================
function generateHomework() {

  const subject = document.getElementById("subject").value;
  const material = document.getElementById("material").value;

  const base = DATA.filter(d =>
    d.subject === subject &&
    d.material === material
  );

  // =========================
  // スコアリングAI
  // =========================
  const scored = base.map(q => {

    const w = WEAK[q.prompt]?.count || 0;
    const last = WEAK[q.prompt]?.last || 0;

    const recency = Date.now() - last;

    const score = (w * 5) + (recency / 100000);

    return { q, score };
  });

  // 上位を宿題にする
  HOMEWORK = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.q);

  CURRENT = HOMEWORK;

  render();

  document.getElementById("stats").innerHTML =
    "📚 宿題が生成されました（AI出題）";
}

// =========================
// 表示
// =========================
function render() {

  document.getElementById("output").innerHTML =
    CURRENT.map((q, i) => `
      <div style="margin-bottom:12px;">
        <b>${i + 1}.</b> ${q.prompt}<br>
        <input id="ans_${i}">
        <button onclick="check(${i})">判定</button>
        <div id="result_${i}"></div>
      </div>
    `).join("");
}

// =========================
// 判定
// =========================
function check(i) {

  const q = CURRENT[i];
  const user = document.getElementById(`ans_${i}`).value.trim();
  const ok = user === q.answer.trim();

  if (!WEAK[q.prompt]) {
    WEAK[q.prompt] = { count: 0, last: 0 };
  }

  if (!ok) {
    WEAK[q.prompt].count++;
  }

  WEAK[q.prompt].last = Date.now();

  localStorage.setItem(`weak_${studentId}`, JSON.stringify(WEAK));

  document.getElementById(`result_${i}`).innerHTML =
    ok ? "🟢 正解" : `🔴 正解: ${q.answer}`;
}