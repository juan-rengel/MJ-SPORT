// /src/routes/saleRoutes.js
const express = require('express');
const controller = require('../controllers/saleController');

const router = express.Router();

router.get('/', controller.listSales);
router.post('/', controller.createSale);
router.post('/:id/cancelar', controller.cancelSale);

module.exports = router;
