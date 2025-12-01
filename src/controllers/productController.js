// /src/controllers/productController.js
const productModel = require('../models/productModel');

async function listProducts(req, res) {
  try {
    const { categoriaId } = req.query;
    const produtos = await productModel.getAllProducts(categoriaId);
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProduct(req, res) {
  try {
    const produto = await productModel.getProductById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const produto = await productModel.createProduct(req.body);
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const produto = await productModel.updateProduct(req.params.id, req.body);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    await productModel.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
