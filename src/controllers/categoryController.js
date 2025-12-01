// /src/controllers/categoryController.js
const categoryModel = require('../models/categoryModel');

async function listCategories(req, res) {
  try {
    const categorias = await categoryModel.getAllCategories();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const categoria = await categoryModel.createCategory(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  listCategories,
  createCategory
};
