const express = require("express");
const router = express.Router();
const controller = require("../controllers/exportController");

router.get("/vendas/excel", controller.exportarVendasExcel);
router.get("/movimentacoes/excel", controller.exportarMovimentosExcel);
router.get("/produtos/excel", controller.exportarProdutosExcel);

router.post("/relatorio/pdf", controller.exportarRelatorioPDF);

module.exports = router;
