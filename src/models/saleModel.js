// /src/models/saleModel.js
const db = require('../database/firebase');
const { Timestamp, FieldValue } = require('firebase-admin/firestore');

const salesCol = db.collection('vendas');
const productsCol = db.collection('produtos');
const stockMovesCol = db.collection('estoque_movimentacoes');

async function createSale(data) {
  const now = Timestamp.now();
  const itens = data.itens || []; // [{produtoId, quantidade, precoVenda}]
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error('A venda precisa de ao menos 1 item.');
  }

  let total = 0;

  // Valida produtos e calcula total
  const batch = db.batch();
  for (const item of itens) {
    const prodRef = productsCol.doc(item.produtoId);
    const prodSnap = await prodRef.get();
    if (!prodSnap.exists) {
      throw new Error(`Produto não encontrado: ${item.produtoId}`);
    }
    const prod = prodSnap.data();
    const qtd = Number(item.quantidade) || 0;

    if (prod.estoqueAtual < qtd) {
      throw new Error(`Estoque insuficiente para produto: ${prod.nome}`);
    }

    const precoVenda = Number(item.precoVenda || prod.precoVenda);
    const subtotal = precoVenda * qtd;
    total += subtotal;

    // Atualiza estoque
    batch.update(prodRef, {
      estoqueAtual: FieldValue.increment(-qtd),
      updatedAt: now
    });

    // Registra movimentação de estoque
    const movRef = stockMovesCol.doc();
    batch.set(movRef, {
      produtoId: item.produtoId,
      tipo: 'saida',
      quantidade: qtd,
      origem: 'venda',
      createdAt: now
    });
  }

  const venda = {
    itens,
    total,
    status: 'concluida',
    createdAt: now,
    updatedAt: now
  };

  const saleRef = salesCol.doc();
  batch.set(saleRef, venda);

  await batch.commit();

  return { id: saleRef.id, ...venda };
}

async function cancelSale(id) {
  const saleRef = salesCol.doc(id);
  const saleSnap = await saleRef.get();
  if (!saleSnap.exists) throw new Error('Venda não encontrada');

  const sale = saleSnap.data();
  if (sale.status === 'cancelada') {
    throw new Error('Venda já está cancelada');
  }

  const now = Timestamp.now();
  const batch = db.batch();

  // Estornar estoque
  for (const item of sale.itens) {
    const prodRef = productsCol.doc(item.produtoId);
    const qtd = Number(item.quantidade) || 0;

    batch.update(prodRef, {
      estoqueAtual: FieldValue.increment(qtd),
      updatedAt: now
    });

    const movRef = stockMovesCol.doc();
    batch.set(movRef, {
      produtoId: item.produtoId,
      tipo: 'estorno',
      quantidade: qtd,
      origem: 'cancelamento_venda',
      vendaId: id,
      createdAt: now
    });
  }

  batch.update(saleRef, {
    status: 'cancelada',
    updatedAt: now
  });

  await batch.commit();

  return { id, ...sale, status: 'cancelada' };
}

async function getSales() {
  const snap = await salesCol.orderBy('createdAt', 'desc').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  createSale,
  cancelSale,
  getSales
};
