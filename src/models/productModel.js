// /src/models/productModel.js
const db = require('../database/firebase');
const { Timestamp } = require('firebase-admin/firestore');

const collection = db.collection('produtos');

async function getAllProducts(categoryId) {
  let query = collection;
  if (categoryId) {
    query = query.where('categoriaId', '==', categoryId);
  }
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getProductById(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createProduct(data) {
  const now = Timestamp.now();
  const produto = {
    nome: data.nome,
    categoriaId: data.categoriaId || null,
    precoCompra: Number(data.precoCompra) || 0,
    precoVenda: Number(data.precoVenda) || 0,
    estoqueAtual: Number(data.estoqueAtual) || 0,
    estoqueMinimo: Number(data.estoqueMinimo) || 0,
    sku: data.sku || null,
    imagemUrl: data.imagemUrl || null,
    createdAt: now,
    updatedAt: now
  };
  const docRef = await collection.add(produto);
  return { id: docRef.id, ...produto };
}

async function updateProduct(id, data) {
  const ref = collection.doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;

  const updated = {
    ...data,
    precoCompra: data.precoCompra !== undefined ? Number(data.precoCompra) : doc.data().precoCompra,
    precoVenda: data.precoVenda !== undefined ? Number(data.precoVenda) : doc.data().precoVenda,
    estoqueAtual: data.estoqueAtual !== undefined ? Number(data.estoqueAtual) : doc.data().estoqueAtual,
    estoqueMinimo: data.estoqueMinimo !== undefined ? Number(data.estoqueMinimo) : doc.data().estoqueMinimo,
    updatedAt: Timestamp.now()
  };

  await ref.update(updated);
  const finalDoc = await ref.get();
  return { id: finalDoc.id, ...finalDoc.data() };
}

async function deleteProduct(id) {
  await collection.doc(id).delete();
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
