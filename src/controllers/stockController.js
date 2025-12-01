// /src/controllers/stockController.js
const stockMovementModel = require('../models/stockMovementModel');

async function manualEntry(req, res) {
  try {
    const mov = await stockMovementModel.manualStockEntry(req.body);
    res.status(201).json(mov);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function lowStock(req, res) {
  try {
    const produtos = await stockMovementModel.getLowStockProducts();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  manualEntry,
  lowStock
};
