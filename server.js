// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const saleRoutes = require("./src/routes/saleRoutes");
const stockRoutes = require("./src/routes/stockRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const exportRoutes = require("./src/routes/exportRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/pages", express.static(path.join(__dirname, "pages")));

// 🔥 ROTA DE LOGIN (somente GET) — DEVE FICAR FORA DAS ROTAS DA API
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html"));
});

// 🔥 TODAS AS ROTAS API COMEÇAM COM /api
app.use("/api/auth", authRoutes);
app.use("/api/produtos", productRoutes);
app.use("/api/categorias", categoryRoutes);
app.use("/api/vendas", saleRoutes);
app.use("/api/estoque", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/historico", historyRoutes);
app.use("/api/exportar", exportRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "dashboard.html"));
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
