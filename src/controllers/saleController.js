// /src/controllers/saleController.js
const saleModel = require('../models/saleModel');

async function listSales(req, res) {
  try {
    const vendas = await saleModel.getSales();
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createSale(req, res) {
  try {
    const venda = await saleModel.createSale(req.body);
    res.status(201).json(venda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function cancelSale(req, res) {
  try {
    const venda = await saleModel.cancelSale(req.params.id);
    res.json(venda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  listSales,
  createSale,
  cancelSale
};
