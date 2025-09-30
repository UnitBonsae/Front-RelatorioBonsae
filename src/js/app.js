// URL base da API
const URL_BASE = "https://localhost:7293/api/SolicitacaoRelatorio";

// Seletores
const listaRelatorios = document.getElementById("reportList");
const formulario = document.getElementById("reportForm");

// Array local de relatórios
let relatorios = [];

// --- Evento submit ---
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const idTurma = parseInt(document.getElementById("idTurma").value, 10);
  const formatoSaida = document.getElementById("output").value;
  const tipoRelatorio = formatoSaida === "xlsx" ? 1 : 2;

  const relatorio = {
    idTurma,
    tipoRelatorio: formatoSaida,
    status: "Solicitado",
    mensagem: "Aguardando geração...",
    id: null,
    urlDownload: null,
    nomeArquivo: null,
    dataSolicitacao: null, // será preenchida quando buscar pelo GET
  };

  relatorios.push(relatorio);
  renderizarRelatorios();

  try {
    // Solicitação POST
    const resposta = await fetch(URL_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idTurma, tipoRelatorio }),
    });
    if (!resposta.ok) throw new Error("Erro ao enviar solicitação");

    console.log("Solicitação enviada com sucesso");

    // Pegar último relatório criado
    const respostaLista = await fetch(URL_BASE);
    const dadosLista = await respostaLista.json();
    const ultimo = dadosLista[dadosLista.length - 1];

    relatorio.id = ultimo.id;
    relatorio.status = ultimo.status;
    relatorio.mensagem = "Relatório solicitado, aguarde...";
    relatorio.dataSolicitacao = ultimo.dataSolicitacao;
    renderizarRelatorios();

    acompanharRelatorio(relatorio);
  } catch (erro) {
    relatorio.status = "Erro";
    relatorio.mensagem = erro.message;
    renderizarRelatorios();
  }
});

// --- Função para acompanhar status ---
function acompanharRelatorio(relatorio) {
  const intervaloId = setInterval(async () => {
    try {
      const respostaLista = await fetch(URL_BASE);
      const dadosLista = await respostaLista.json();
      const atual = dadosLista.find((r) => r.id === relatorio.id);
      if (!atual) return;

      relatorio.status = atual.status;

      if (atual.status === "Concluido") {
        clearInterval(intervaloId);

        const respostaArquivo = await fetch(
          `https://localhost:7293/api/RelatorioGerado/por-id-solicitacao?Id=${relatorio.id}`
        );
        const dadosArquivo = await respostaArquivo.json();

        relatorio.urlDownload = dadosArquivo.conteudoArquivo; // base64
        relatorio.nomeArquivo = dadosArquivo.nomeArquivo;
        relatorio.mensagem = "Pronto para baixar";
      } else {
        relatorio.mensagem = "Ainda em processamento...";
      }

      renderizarRelatorios();
    } catch (erro) {
      clearInterval(intervaloId);
      relatorio.status = "Erro";
      relatorio.mensagem = erro.message;
      renderizarRelatorios();
    }
  }, 2000); // checa a cada 2 segundos
}

// --- Função para baixar relatório pelo ID ---
async function baixarRelatorio(id) {
  const relatorio = relatorios.find((r) => r.id === id);
  if (!relatorio || !relatorio.urlDownload) return;

  converterBase64(relatorio.tipoRelatorio, relatorio.urlDownload, relatorio.nomeArquivo);
}

// --- Função para converter Base64 em Blob e iniciar download ---
function converterBase64(tipoRelatorio, base64, nomeArquivo) {
  let tipoMime;
  if (tipoRelatorio === 1) {
    tipoMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else {
    tipoMime = "application/pdf";
  }

  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: tipoMime });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo || (tipoRelatorio === 1 ? "relatorio.xlsx" : "relatorio.pdf");
  link.click();

  // libera memória após 1 minuto
  setTimeout(() => URL.revokeObjectURL(link.href), 60000);
}

// --- Função para renderizar tabela ---
// --- Função para renderizar tabela ---
function renderizarRelatorios() {
  listaRelatorios.innerHTML = "";

  relatorios.forEach((r) => {
    const linha = document.createElement("tr");

    // Formata a data de solicitação
    const dataFormatada = r.dataSolicitacao
      ? new Date(r.dataSolicitacao).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Converte idTurma em letra
    // Converte idTurma em letra
    function idTurmaParaLetra(id) {
      switch (id) {
        case 1: return "A";
        case 2: return "B";
        case 3: return "C";
        default: return "-";
      }
    }

    // Botão de download ou mensagem
    const acaoHTML =
      r.status === "Concluido"
        ? `<button onclick="baixarRelatorio(${r.id})">Baixar</button>`
        : r.mensagem;

    linha.innerHTML = `
      <td>${dataFormatada}</td>
      <td>${r.tipoRelatorio}</td>
      <td>${idTurmaParaLetra(r.idTurma)}</td>
      <td>${acaoHTML}</td>
    `;

    listaRelatorios.appendChild(linha);
  });
}
