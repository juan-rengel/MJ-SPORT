// /public/js/sales.js

let produtos = [];
let itens = [];
let totalVenda = 0;

// -----------------------------
// 1. Carregar lista de produtos
// -----------------------------
async function carregarProdutos() {
  produtos = await apiGet("/produtos");

  const select = document.getElementById("produtoSelect");
  select.innerHTML = '<option value="">Selecione</option>';

  produtos.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nome} (R$ ${p.precoVenda})`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const prod = produtos.find(p => p.id === select.value);
    document.getElementById("precoVenda").value = prod ? prod.precoVenda : "";
  });
}

// -----------------------------
// 2. Adicionar itens na venda
// -----------------------------
document
  .getElementById("btnAdicionarItem")
  .addEventListener("click", () => {
    const produtoId = document.getElementById("produtoSelect").value;
    const qtd = Number(document.getElementById("quantidade").value);

    if (!produtoId) return alert("Selecione um produto");
    if (qtd < 1) return alert("Quantidade inválida");

    const produto = produtos.find(p => p.id === produtoId);
    const subtotal = produto.precoVenda * qtd;

    itens.push({
      produtoId,
      nome: produto.nome,
      precoVenda: produto.precoVenda,
      quantidade: qtd,
      subtotal
    });

    renderTabelaItens();
  });

// -----------------------------
// 3. Renderizar itens
// -----------------------------
function renderTabelaItens() {
  const tbody = document.getElementById("tabelaItens");
  tbody.innerHTML = "";
  totalVenda = 0;

  itens.forEach((item, index) => {
    totalVenda += item.subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>R$ ${item.precoVenda.toFixed(2)}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${item.subtotal.toFixed(2)}</td>
      <td><button class="btn-outline" data-index="${index}">Remover</button></td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("totalVenda").textContent =
    totalVenda.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  // Remover item
  tbody.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      itens.splice(index, 1);
      renderTabelaItens();
    });
  });
}

// -----------------------------
// 4. Finalizar venda
// -----------------------------
document
  .getElementById("btnFinalizarVenda")
  .addEventListener("click", async () => {
    if (itens.length === 0) return alert("Nenhum item na venda.");

    try {
      await apiPost("/vendas", { itens });
      alert("Venda registrada com sucesso!");

      itens = [];
      renderTabelaItens();
      carregarVendas();
    } catch (err) {
      alert("Erro ao registrar venda: " + err.message);
    }
  });

// -----------------------------
// 5. Carregar lista de vendas
// -----------------------------
async function carregarVendas() {
  const vendas = await apiGet("/vendas");
  const tbody = document.getElementById("tabelaVendas");
  tbody.innerHTML = "";

  vendas.forEach(v => {
    const data = new Date(v.createdAt._seconds * 1000);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>R$ ${v.total.toFixed(2)}</td>
      <td>${v.status}</td>
      <td>${data.toLocaleString()}</td>
      <td>
        ${v.status === "concluida"
          ? `<button class="btn-outline" data-id="${v.id}">Cancelar</button>`
          : ""
        }
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Botões cancelar
  tbody.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = btn.dataset.id;
      if (confirm("Deseja cancelar esta venda?")) {
        await apiPost(`/vendas/${id}/cancelar`);
        carregarVendas();
      }
    });
  });
}

// -----------------------------
// Inicialização da página
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  carregarVendas();
});
