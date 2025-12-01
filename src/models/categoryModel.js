// /src/models/categoryModel.js
const db = require('../database/firebase');
const { Timestamp } = require('firebase-admin/firestore');

const collection = db.collection('categorias');

async function getAllCategories() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function createCategory(data) {
  const now = Timestamp.now();
  const categoria = {
    nome: data.nome,
    descricao: data.descricao || null,
    createdAt: now,
    updatedAt: now
  };
  const docRef = await collection.add(categoria);
  return { id: docRef.id, ...categoria };
}

module.exports = {
  getAllCategories,
  createCategory
};
