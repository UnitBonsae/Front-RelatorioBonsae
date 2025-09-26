const URLsolicitacao = "https://localhost:7293/api/SolicitacaoRelatorio";

// Função para chamar a API e preencher a tabela
async function chamarAPI() {
  // Chama a API e obtém os dados
  const resp = await fetch(URLsolicitacao);

  if (resp.status === 200) {
    // Converte a resposta para JSON
    const lista = await resp.json();
    console.log(lista);
    preencherTabela(lista);
  }
}
chamarAPI();

// Converte idTurma em letra
function idTurmaParaLetra(id) {
  switch (id) {
    case 1: return "A";
    case 2: return "B";
    case 3: return "C";
    default: return "-";
  }
}



// Função para preencher a tabela com os dados da API
function preencherTabela(relatorio) {
  const tabela = document.querySelector("#tabelaHistorico tbody");
  tabela.innerHTML = "";

  //   Adiciona uma linha para cada item no array
  relatorio.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(item.dataSolicitacao).toLocaleDateString()}</td>
      <td>${item.tipoRelatorio}</td>
      <td>${idTurmaParaLetra(item.turmaId)}</td>
      <td>
        <button onclick="baixarRelatorio(${item.id})">Baixar</button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

// Função para baixar o relatório
async function baixarRelatorio(id) {
  const urlDownload = `https://localhost:7293/api/RelatorioGerado/por-id-solicitacao?Id=${id}`;
  const resp = await fetch(urlDownload);
  if (resp.status === 200) {
    const dados = await resp.json();
    console.log(dados);
    converterBase64(dados.tipoRelatorio, dados.conteudoArquivo);
  }
}

// Função para converter base64 e iniciar o download
function converterBase64(Tipo, Base64, nomeArquivo = null) {
  // Detecta a extensão pelo tipo
  let extensao = "txt"; // padrão
  if (Tipo === "Excel") extensao = "xlsx";
  else if (Tipo === "PDF") extensao = "pdf";

  const fileName = nomeArquivo ? nomeArquivo : `relatorio.${extensao}`;

  // Converte base64 em bytes
  const bytes = Uint8Array.from(atob(Base64), (c) => c.charCodeAt(0));

  // Cria o Blob
  const blob = new Blob([bytes]);

  // Cria link temporário para download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  // Libera a memória
  URL.revokeObjectURL(link.href);
}