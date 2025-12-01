const express = require("express");
const controller = require("../controllers/historyController");

const router = express.Router();

router.post("/buscar", controller.buscarMovimentos);

module.exports = router;
