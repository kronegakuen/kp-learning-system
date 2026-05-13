console.log("KRONE Prep JS loaded");

// =======================
// データ保持
// =======================
let DATA = [];

// =======================
// Google Apps Script から取得
// =======================
async function loadData() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyTF8pd6_KVnw-qS4tIJLFbIKaoARErmH2hlpLax3LIdoc2MSoAkbJMgz052aV-SAZzxw/exec");
    DATA = await res.json();
    console.log("データ取得成功:", DATA.length);
  } catch (e) {
    console.error("データ取得エラー:", e);
  }
}

// =======================
// テスト生成
// =======================
function generate() {
  if (!DATA.length) {
    document.getElementById("output").innerHTML =
      "データ読み込み中です...";
    return;
  }

  const grade = document.getElementById("grade").value;
  const theme = document.getElementById("theme").value;
  const range = document.getElementById("range").value;
  const num = Number(document.getElementById("num").value);

  // 範囲フィルタ（例: 1-30）
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

  // シャッフル
  filtered = filtered.sort(() => Math.random() - 0.5);

  // 件数制限
  filtered = filtered.slice(0, num);

  // 出力
  document.getElementById("output").innerHTML =
    filtered.map((q, i) => `
      <div style="margin-bottom:8px;">
        <b>${i + 1}.</b> ${q.phrase}（${q.meaning}）
      </div>
    `).join("");
}

// =======================
// 初期化
// =======================
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generate);
  loadData();
});