// /public/js/history.js

let produtos = [];

// ------------------------------------------------------
// Carregar produtos no filtro
// ------------------------------------------------------
async function carregarProdutos() {
  produtos = await apiGet("/produtos");

  const select = document.getElementById("filtroProduto");
  select.innerHTML = '<option value="">Todos</option>';

  produtos.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
}

// ------------------------------------------------------
// Carregar movimentos
// ------------------------------------------------------
async function carregarMovimentos(filtros = {}) {
  const movimentos = await apiPost("/historico/buscar", filtros);

  const tbody = document.getElementById("tabelaMovimentos");
  tbody.innerHTML = "";

  movimentos.forEach(m => {
    const data = m.createdAt ? new Date(m.createdAt._seconds * 1000) : null;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data ? data.toLocaleString() : "--"}</td>
      <td>${m.produtoNome || "--"}</td>
      <td>${m.tipo}</td>
      <td>${m.quantidade}</td>
      <td>${m.origem || "--"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------------------------------------
// Filtros
// ------------------------------------------------------
document.getElementById("formFiltros").addEventListener("submit", async (e) => {
  e.preventDefault();

  const filtros = {
    inicio: document.getElementById("dataInicio").value,
    fim: document.getElementById("dataFim").value,
    tipo: document.getElementById("filtroTipo").value,
    produtoId: document.getElementById("filtroProduto").value
  };

  await carregarMovimentos(filtros);
});

// ------------------------------------------------------
// Inicialização
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutos();
  await carregarMovimentos();
});
