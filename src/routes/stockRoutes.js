// /src/routes/stockRoutes.js
const express = require('express');
const controller = require('../controllers/stockController');

const router = express.Router();

router.post('/movimentacao', controller.manualEntry);
router.get('/baixo-estoque', controller.lowStock);

module.exports = router;
