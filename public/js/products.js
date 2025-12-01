// /public/js/products.js

let categorias = [];

async function carregarCategorias(selectId) {
  const data = await apiGet('/categorias');
  categorias = data;
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Todas</option>';
  data.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nome;
    select.appendChild(opt);
  });
}

async function carregarCategoriasForm() {
  const data = await apiGet('/categorias');
  const select = document.getElementById('categoriaId');
  select.innerHTML = '<option value="">Selecione</option>';
  data.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nome;
    select.appendChild(opt);
  });
}

async function carregarProdutos() {
  const categoriaId = document.getElementById('filtroCategoria').value;
  const query = categoriaId ? `?categoriaId=${categoriaId}` : '';
  const produtos = await apiGet('/produtos' + query);

  const tbody = document.getElementById('tabelaProdutos');
  tbody.innerHTML = '';

  produtos.forEach(p => {
    const tr = document.createElement('tr');

    const catName =
      (categorias.find(c => c.id === p.categoriaId) || {}).nome ||
      '—';

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${catName}</td>
      <td>${formatCurrency(p.precoVenda || 0)}</td>
      <td>${p.estoqueAtual || 0}</td>
      <td>${p.sku || '—'}</td>
      <td>
        <button class="btn-outline" data-id="${p.id}" data-acao="editar">Editar</button>
        <button class="btn-outline" data-id="${p.id}" data-acao="excluir">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function preencherForm(produto) {
  document.getElementById('produtoId').value = produto.id || '';
  document.getElementById('nome').value = produto.nome || '';
  document.getElementById('categoriaId').value = produto.categoriaId || '';
  document.getElementById('sku').value = produto.sku || '';
  document.getElementById('precoCompra').value = produto.precoCompra || '';
  document.getElementById('precoVenda').value = produto.precoVenda || '';
  document.getElementById('estoqueAtual').value = produto.estoqueAtual || '';
  document.getElementById('estoqueMinimo').value = produto.estoqueMinimo || '';
}

async function salvarProduto(e) {
  e.preventDefault();
  const id = document.getElementById('produtoId').value;

  const body = {
    nome: document.getElementById('nome').value,
    categoriaId: document.getElementById('categoriaId').value || null,
    sku: document.getElementById('sku').value,
    precoCompra: Number(document.getElementById('precoCompra').value || 0),
    precoVenda: Number(document.getElementById('precoVenda').value || 0),
    estoqueAtual: Number(document.getElementById('estoqueAtual').value || 0),
    estoqueMinimo: Number(document.getElementById('estoqueMinimo').value || 0)
  };

  try {
    if (id) {
      await apiPut(`/produtos/${id}`, body);
    } else {
      await apiPost('/produtos', body);
    }
    await carregarProdutos();
    document.getElementById('formProduto').reset();
    document.getElementById('produtoId').value = '';
  } catch (err) {
    alert(err.message);
  }
}

function setupEventosTabela() {
  document
    .getElementById('tabelaProdutos')
    .addEventListener('click', async e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const acao = btn.dataset.acao;

      if (acao === 'editar') {
        const produto = await apiGet(`/produtos/${id}`);
        preencherForm(produto);
      }

      if (acao === 'excluir') {
        if (confirm('Confirma excluir este produto?')) {
          await apiDelete(`/produtos/${id}`);
          await carregarProdutos();
        }
      }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarCategorias('filtroCategoria');
  await carregarCategoriasForm();
  await carregarProdutos();
  setupEventosTabela();

  document
    .getElementById('filtroCategoria')
    .addEventListener('change', carregarProdutos);

  document
    .getElementById('formProduto')
    .addEventListener('submit', salvarProduto);
});
