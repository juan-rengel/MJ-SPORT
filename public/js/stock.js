// /public/js/stock.js

let produtos = [];

// -----------------------
// 1. Carregar produtos
// -----------------------
async function carregarProdutos() {
  produtos = await apiGet("/produtos");

  const select = document.getElementById("movProduto");
  select.innerHTML = '<option value="">Selecione</option>';

  produtos.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nome} (Estoque: ${p.estoqueAtual})`;
    select.appendChild(opt);
  });
}

// -----------------------
// 2. Carregar produtos em baixo estoque
// -----------------------
async function carregarBaixoEstoque() {
  const baixo = await apiGet("/estoque/baixo-estoque");

  const tbody = document.getElementById("tabelaBaixoEstoque");
  tbody.innerHTML = "";

  baixo.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.estoqueAtual}</td>
      <td>${p.estoqueMinimo}</td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------
// 3. Registrar movimentação
// -----------------------
async function registrarMovimento(e) {
  e.preventDefault();

  const produtoId = document.getElementById("movProduto").value;
  const tipo = document.getElementById("movTipo").value;
  const quantidade = Number(document.getElementById("movQtd").value);
  const origem = document.getElementById("movOrigem").value;

  if (!produtoId) return alert("Selecione um produto");
  if (quantidade < 1) return alert("Quantidade inválida");

  try {
    await apiPost("/estoque/movimentacao", {
      produtoId,
      tipo,
      quantidade,
      origem
    });

    alert("Movimentação registrada com sucesso!");

    // Atualizar dados
    document.getElementById("formMovimento").reset();
    carregarProdutos();
    carregarBaixoEstoque();
  } catch (err) {
    alert("Erro ao registrar movimentação: " + err.message);
  }
}

// -----------------------
// Inicialização
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  carregarBaixoEstoque();
  document.getElementById("formMovimento")
    .addEventListener("submit", registrarMovimento);
});
