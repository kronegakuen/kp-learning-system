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
  const mode = document.getElementById("mode").value;

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
  CURRENT.mode = mode;

  renderQuiz();
}

// 表示
function renderQuiz() {
  const mode = CURRENT.mode;

  document.getElementById("output").innerHTML =
    CURRENT.map((q, i) => {

      // 意味を書く
      if (mode === "meaning") {
        return `
          <div style="margin-bottom:12px;">
            <b>${i + 1}.</b> ${q.phrase}<br>
            <input type="text" id="ans_${i}" placeholder="意味を書く" style="width:80%;">
            <button onclick="check(${i})">判定</button>
            <div id="result_${i}"></div>
          </div>
        `;
      }

      // ことわざを書く
      return `
        <div style="margin-bottom:12px;">
          <b>${i + 1}.</b> ${q.meaning}<br>
          <input type="text" id="ans_${i}" placeholder="ことわざを書く" style="width:80%;">
          <button onclick="check(${i})">判定</button>
          <div id="result_${i}"></div>
        </div>
      `;
    }).join("");
}

// 判定
function check(i) {
  const mode = CURRENT.mode;
  const userAnswer = document.getElementById(`ans_${i}`).value.trim();

  let correct = "";

  if (mode === "meaning") {
    correct = CURRENT[i].meaning.trim();
  } else {
    correct = CURRENT[i].phrase.trim();
  }

  const result = document.getElementById(`result_${i}`);

  if (userAnswer === correct) {
    result.innerHTML = "🟢 正解！";
    result.style.color = "green";
  } else {
    result.innerHTML = `🔴 不正解（答え：${correct}）`;
    result.style.color = "red";
  }
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generate);
  loadData();
});