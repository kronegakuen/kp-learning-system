console.log("JS読み込みOK");

let DATA = [];

async function loadData() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbyTF8pd6_KVnw-qS4tIJLFbIKaoARErmH2hlpLax3LIdoc2MSoAkbJMgz052aV-SAZzxw/exec");
  DATA = await res.json();
}

function generate() {
  console.log("ボタン押された");

  document.getElementById("output").innerHTML =
    "ボタンは動いてる";
}

loadData();