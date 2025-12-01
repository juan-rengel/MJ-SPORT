// /public/js/reports.js

let graficoDias = null;
let graficoCategorias = null;

// ------------------------------------------------------
// 1. Formatar moeda
// ------------------------------------------------------
function formatCurrency(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ------------------------------------------------------
// 2. Aplicar filtro de datas
// ------------------------------------------------------
document.getElementById("formFiltro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;

  if (!inicio || !fim) {
    return alert("Selecione um período válido.");
  }

  const dados = await apiPost("/dashboard/resumo-periodo", {
    inicio,
    fim
  });

  preencherIndicadores(dados);
  preencherTabelaMaisVendidos(dados.maisVendidos);
  gerarGraficoDias(dados.faturamentoDias);
  gerarGraficoCategorias(dados.categorias);
});

// ------------------------------------------------------
// 3. Preencher indicadores
// ------------------------------------------------------
function preencherIndicadores(d) {
  document.getElementById("fatPeriodo").textContent = formatCurrency(d.faturamentoTotal);
  document.getElementById("vendidoPeriodo").textContent = formatCurrency(d.totalVendido);
  document.getElementById("lucroPeriodo").textContent = formatCurrency(d.lucro);
  document.getElementById("margemPeriodo").textContent = `${d.margem.toFixed(1)}%`;
}

// ------------------------------------------------------
// 4. Tabela de produtos mais vendidos
// ------------------------------------------------------
function preencherTabelaMaisVendidos(lista) {
  const tbody = document.getElementById("tabelaMaisVendidos");
  tbody.innerHTML = "";

  lista.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.quantidade}</td>
      <td>${formatCurrency(p.total)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------------------------------------
// 5. Gráfico de faturamento por dia
// ------------------------------------------------------
function gerarGraficoDias(data) {
  const ctx = document.getElementById("grafFaturamento");

  if (graficoDias) graficoDias.destroy();

  graficoDias = new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Faturamento por dia",
        data: Object.values(data)
      }]
    },
    options: { responsive: true }
  });
}

// ------------------------------------------------------
// 6. Gráfico de faturamento por categorias
// ------------------------------------------------------
function gerarGraficoCategorias(data) {
  const ctx = document.getElementById("grafCategorias");

  if (graficoCategorias) graficoCategorias.destroy();

  graficoCategorias = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Total por categoria",
        data: Object.values(data)
      }]
    },
    options: { responsive: true }
  });
}


function gerarPDF() {
  apiPost("/api/exportar/relatorio/pdf", {
    titulo: "Relatório Personalizado",
    dados: {
      Faturamento: "R$ 3.500",
      Vendas: 18,
      Lucro: "R$ 1.200"
    }
  });
}

