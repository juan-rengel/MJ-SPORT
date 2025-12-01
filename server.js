// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Páginas HTML
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Rotas API
app.use('/api/produtos', productRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/vendas', saleRoutes);
app.use('/api/estoque', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Página inicial -> dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
