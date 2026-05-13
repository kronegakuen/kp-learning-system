console.log("編集できてる");

let DATA = [];

async function loadData() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbyTF8pd6_KVnw-qS4tIJLFbIKaoARErmH2hlpLax3LIdoc2MSoAkbJMgz052aV-SAZzxw/exec");
  DATA = await res.json();
}

function generate() {
  const grade = document.getElementById("grade").value;
  const theme = document.getElementById("theme").value;
  const num = Number(document.getElementById("num").value);

  let filtered = DATA.filter(d =>
    d.grade.includes(grade) &&
    (theme === "" || d.theme.includes(theme))
  );

  filtered = filtered.sort(() => Math.random() - 0.5).slice(0, num);

  document.getElementById("output").innerHTML =
    filtered.map((q, i) => `
      <div>
        <b>${i + 1}.</b> ${q.phrase}（${q.meaning}）
      </div>
    `).join("");
}

loadData();