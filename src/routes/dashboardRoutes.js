// /src/routes/dashboardRoutes.js
const express = require('express');
const controller = require('../controllers/dashboardController');

const router = express.Router();

router.get('/resumo', controller.getSummary);

module.exports = router;
