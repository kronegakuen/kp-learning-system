console.log("KRONE Prep JS loaded");

let DATA = [];
let CURRENT = [];
let SHOW_ANSWER = false;

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
  SHOW_ANSWER = false;

  render();
}

// 描画
function render() {
  const html = CURRENT.map((q, i) => {
    return SHOW_ANSWER
      ? `<div style="margin-bottom:10px;">
           <b>${i + 1}.</b> ${q.phrase}（${q.meaning}）
         </div>`
      : `<div style="margin-bottom:10px;">
           <b>${i + 1}.</b> ${q.phrase}（　　　　）
         </div>`;
  }).join("");

  const btnLabel = SHOW_ANSWER ? "問題に戻る" : "解答を見る";

  document.getElementById("output").innerHTML =
    html +
    `<br><button id="toggleBtn">${btnLabel}</button>`;
}

// トグル
function toggleAnswer() {
  SHOW_ANSWER = !SHOW_ANSWER;
  render();
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generate);

  document.addEventListener("click", (e) => {
    if (e.target.id === "toggleBtn") {
      toggleAnswer();
    }
  });

  loadData();
});