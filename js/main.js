function generate() {
  const grade = document.getElementById("grade").value;
  const theme = document.getElementById("theme").value;
  const range = document.getElementById("range").value;
  const num = document.getElementById("num").value;

  document.getElementById("output").innerHTML = `
    <h2>結果</h2>
    <p>学年：${grade}</p>
    <p>テーマ：${theme}</p>
    <p>範囲：${range}</p>
    <p>問題数：${num}</p>
    <hr>
    <p>ここに問題が表示されます（次のステップで実装）</p>
  `;
}