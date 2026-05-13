console.log("KRONE Prep JS loaded");

let DATA = [];
let CURRENT = [];

// データ取得
async function loadData() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyTF8pd6_KVnw-qS4tIJLFbIKaoARErmH2hlpLax3LIdoc2MSoAkbJMgz052aV-SAZzxw/exec");
    DATA = await res.json();
    console.log("データ取得成功:", DATA.length);
  } catch (e) {
    console.error("データ取得エラー:", e);
  }
}

// テスト生成
function generate() {
  const grade = document.getElementById("grade").value;
  const theme = document.getElementById("theme").value;
  const range = document.getElementById("range").value;
  const num = Number(document.getElementById("num").value);

  let filtered = DATA.filter(d => {
    const matchGrade = d.grade.includes(grade);
    const matchTheme = theme === "" || d.theme.includes(theme);

    let matchRange = true;
    if (range.includes("-")) {
      const [min, max] = range.split("-").map(Number);
      matchRange = d.no >= min && d.no <= max;
    }

    return matchGrade && matchTheme && matchRange;
  });

  filtered = filtered.sort(() => Math.random() - 0.5).slice(0, num);

  CURRENT = filtered;

  renderQuiz();
}

// 問題表示（答え隠す）
function renderQuiz() {
  document.getElementById("output").innerHTML =
    CURRENT.map((q, i) => `
      <div style="margin-bottom:10px;">
        <b>${i + 1}.</b> ${q.phrase}（　　　　）
      </div>
    `).join("") +
    `<br><button id="showAnswer">解答を見る</button>`;
}

// 解答表示
function showAnswer() {
  document.getElementById("output").innerHTML =
    CURRENT.map((q, i) => `
      <div style="margin-bottom:10px;">
        <b>${i + 1}.</b> ${q.phrase}（${q.meaning}）
      </div>
    `).join("");
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generate);
  loadData();

  // イベント委譲（後から出るボタン対応）
  document.addEventListener("click", (e) => {
    if (e.target.id === "showAnswer") {
      showAnswer();
    }
  });
});