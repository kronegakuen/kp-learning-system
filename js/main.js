let DATA = [];

async function loadData() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbxhpX2df3OgPvqcQpy2in3xZ7AEK0zhifNfmgOsnvicfdffZE3u5j3ZKzjPfdR4mL_wMg/exec");
  DATA = await res.json();
}

function generate() {
  const grade = document.getElementById("grade").value;
  const theme = document.getElementById("theme").value;
  const range = document.getElementById("range").value;
  const num = Number(document.getElementById("num").value);

  let filtered = DATA.filter(d =>
    d.grade === grade &&
    (theme === "" || d.theme.includes(theme))
  );

  filtered = filtered.sort(() => Math.random() - 0.5).slice(0, num);

  const html = filtered.map((q, i) => `
    <div>
      <b>${i + 1}.</b> ${q.phrase}
    </div>
  `).join("");

  document.getElementById("output").innerHTML = html;
}

loadData();