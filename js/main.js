function updateMaterials() {
  const subject = document.getElementById("subject").value;

  const list = [...new Set(
    DATA
      .filter(d => d.subject === subject)
      .map(d => d.material)
  )];

  const sel = document.getElementById("material");

  sel.innerHTML = list.map(m =>
    `<option value="${m}">${m}</option>`
  ).join("");
}

window.addEventListener("DOMContentLoaded", () => {

  document.getElementById("subject").addEventListener("change", () => {
    updateMaterials();
  });

});

async function loadData() {
  const res = await fetch("YOUR_URL");
  DATA = await res.json();

  updateMaterials(); // ←ここ重要
}

const subject = document.getElementById("subject").value;
const material = document.getElementById("material").value;

let filtered = DATA.filter(d =>
  d.subject === subject &&
  d.material === material
);