const express = require('express');
const controller = require('../controllers/dashboardController');

const router = express.Router();

// Resumo geral
router.get('/resumo', controller.getSummary);

// Resumo por período (NOVA ROTA)
router.post('/resumo-periodo', controller.getSummaryByPeriod);

module.exports = router;
