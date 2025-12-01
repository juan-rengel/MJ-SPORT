// /src/models/stockMovementModel.js
const db = require('../database/firebase');
const { Timestamp } = require('firebase-admin/firestore');

const stockMovesCol = db.collection('estoque_movimentacoes');
const productsCol = db.collection('produtos');

async function manualStockEntry({ produtoId, quantidade, tipo, origem }) {
  const now = Timestamp.now();
  const qtd = Number(quantidade) || 0;

  if (!['entrada', 'saida', 'ajuste'].includes(tipo)) {
    throw new Error('Tipo de movimentação inválido');
  }

  const prodRef = productsCol.doc(produtoId);
  const prodSnap = await prodRef.get();
  if (!prodSnap.exists) throw new Error('Produto não encontrado');

  const delta = tipo === 'saida' ? -qtd : qtd;

  await prodRef.update({
    estoqueAtual: prodSnap.data().estoqueAtual + delta,
    updatedAt: now
  });

  const mov = {
    produtoId,
    tipo,
    quantidade: qtd,
    origem: origem || 'manual',
    createdAt: now
  };
  const movRef = await stockMovesCol.add(mov);
  return { id: movRef.id, ...mov };
}

async function getLowStockProducts() {
  const snap = await productsCol.get();
  const result = [];
  snap.forEach(doc => {
    const p = doc.data();
    if (p.estoqueMinimo !== undefined && p.estoqueAtual <= p.estoqueMinimo) {
      result.push({ id: doc.id, ...p });
    }
  });
  return result;
}

module.exports = {
  manualStockEntry,
  getLowStockProducts
};
