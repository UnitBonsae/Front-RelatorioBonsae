const API_BASE = "http://localhost:5000";

const form = document.getElementById("reportForm");
const reportList = document.getElementById("reportList");

let reports = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const reportType = document.getElementById("reportType").value;
  const output = document.getElementById("output").value;

  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportType, output }),
  });

  const data = await res.json();
  reports.push({
    id: data.reportId,
    statusUrl: data.statusUrl,
  });

  renderReports();
});

async function refreshStatuses() {
  const updated = await Promise.all(
    reports.map(async (r) => {
      const res = await fetch(r.statusUrl);
      return await res.json();
    })
  );
  reports = updated;
  renderReports();
}

function renderReports() {
  reportList.innerHTML = "";
  reports.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.reportId}</td>
      <td class="status ${r.status}">${r.status}</td>
      <td>${r.message || ""}</td>
      <td>
        ${
          r.downloadUrl
            ? `<a href="${r.downloadUrl}" class="download">Baixar</a>`
            : "-"
        }
      </td>
    `;

    reportList.appendChild(tr);
  });
}

// Atualiza status a cada 5s
setInterval(refreshStatuses, 5000);
