const API_BASE = "https://localhost:7293/api/SolicitacaoRelatorio";
const reportList = document.getElementById("reportList");
const form = document.getElementById("reportForm");

let reports = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idTurma = parseInt(document.getElementById("idTurma").value, 10);
  const output = document.getElementById("output").value;
  const tipoRelatorio = output === "xlsx" ? 1 : 2;

  const report = {
    idTurma,
    tipoRelatorio: output,
    status: "Solicitado",
    message: "Aguardando geração...",
  };

  reports.push(report);
  renderReports();

  try {
    // Envia a solicitação via POST
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idTurma, tipoRelatorio }),
    });

    if (!res.ok) throw new Error("Erro ao enviar solicitação");
    const data = await res.json();
    console.log("Solicitação enviada:", data);
  } catch (err) {
    report.status = "Erro";
    report.message = err.message;
    renderReports();
  }
});

// Função para renderizar a tabela
function renderReports() {
  reportList.innerHTML = "";

  reports.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.idTurma}</td>
      <td>${r.tipoRelatorio}</td>
      <td>${r.status}</td>
      <td>${r.message}</td>
    `;
    reportList.appendChild(tr);
  });
}
