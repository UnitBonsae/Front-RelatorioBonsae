


// const API_BASE = "https://localhost:7293/api/SolicitacaoRelatorio";
// const DOWNLOAD_BASE = "https://localhost:7293/api/RelatorioGerado/por-id-solicitacao";

// const form = document.getElementById("reportForm");
// const reportList = document.getElementById("reportList");

// let reports = [];

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("JS carregado corretamente!");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const idTurma = parseInt(document.getElementById("idTurma").value, 10);
//     const output = document.getElementById("output").value; // "pdf" ou "xlsx"
//     const tipoRelatorio = output === "xlsx" ? 1 : 2;

//     console.log("Form enviado!", { idTurma, output });

//     const report = {
//       idTurma,
//       formato: output,
//       status: "Solicitado",
//       message: "Aguardando geração...",
//       downloadUrl: null
//     };
//     reports.push(report);
//     renderReports();

//     try {
//       const postRes = await fetch(API_BASE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idTurma, tipoRelatorio })
//       });

//       if (!postRes.ok) throw new Error(`Erro na API: ${postRes.status}`);

//       const postData = await postRes.json();
//       console.log("Resposta do POST:", postData);

//       // Workaround: pega a última solicitação do GET
//       const allReportsRes = await fetch(API_BASE);
//       const allReports = await allReportsRes.json();
//       const latestSolicitacao = allReports[allReports.length - 1];

//       if (!latestSolicitacao) {
//         report.status = "Erro";
//         report.message = "Não foi possível identificar a solicitação";
//         renderReports();
//         return;
//       }

//       console.log("Última solicitação detectada:", latestSolicitacao);

//       checkRelatorioAndEnableDownload(report, latestSolicitacao.id);

//     } catch (err) {
//       console.error("Erro ao solicitar relatório:", err);
//       report.status = "Erro";
//       report.message = err.message;
//       renderReports();
//     }
//   });
// });

// async function checkRelatorioAndEnableDownload(report, solicitacaoId) {
//   const getUrl = `${API_BASE}?Id=${solicitacaoId}`;
//   let tentativas = 0;
//   const maxTentativas = 20;
//   const intervalo = 3000;

//   while (tentativas < maxTentativas) {
//     try {
//       const res = await fetch(getUrl);
//       if (!res.ok) throw new Error(`Erro na API GET: ${res.status}`);

//       const data = await res.json();
//       console.log("Checando relatório:", data);

//       const solicitacao = data.find(s => s.id === solicitacaoId) || data[data.length - 1];

//       if (!solicitacao) {
//         console.log("Solicitação ainda não disponível, tentando novamente...");
//         await new Promise(r => setTimeout(r, intervalo));
//         tentativas++;
//         continue;
//       }

//       if (solicitacao.status === "Gerado") {
//         report.status = "Pronto";
//         report.message = "Clique para baixar";
//         report.downloadUrl = `${DOWNLOAD_BASE}?Id=${solicitacao.id}`; // link corrigido
//         renderReports();
//         return;
//       }

//       await new Promise(r => setTimeout(r, intervalo));
//       tentativas++;

//     } catch (err) {
//       console.error("Erro ao checar relatório:", err);
//       report.status = "Erro";
//       report.message = err.message;
//       renderReports();
//       return;
//     }
//   }

//   report.status = "Erro";
//   report.message = "Relatório não ficou pronto a tempo";
//   renderReports();
// }

// function renderReports() {
//   reportList.innerHTML = "";

//   reports.forEach((r) => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td>${r.idTurma}</td>
//       <td>${r.formato}</td>
//       <td>${r.status}</td>
//       <td>${r.message}</td>
//       <td>${r.downloadUrl ? `<a href="${r.downloadUrl}" class="btn btn-primary" target="_blank" download>Download</a>` : ''}</td>
//     `;
//     reportList.appendChild(tr);
//   });
//  }
