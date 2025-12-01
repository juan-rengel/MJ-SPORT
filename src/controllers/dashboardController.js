// /src/controllers/dashboardController.js
const db = require('../database/firebase');

async function getSummary(req, res) {
  try {
    const vendasSnap = await db.collection('vendas').get();
    const produtosSnap = await db.collection('produtos').get();

    let faturamentoTotal = 0;
    let totalInvestido = 0;
    let totalVendido = 0;
    const porCategoria = {};

    produtosSnap.forEach(doc => {
      const p = doc.data();
      totalInvestido += (p.precoCompra || 0) * (p.estoqueAtual || 0);
    });

    vendasSnap.forEach(doc => {
      const v = doc.data();
      if (v.status === 'concluida') {
        faturamentoTotal += v.total || 0;
        v.itens.forEach(item => {
          totalVendido += (item.precoVenda || 0) * (item.quantidade || 0);
          const cat = item.categoriaId || 'sem_categoria';
          porCategoria[cat] = (porCategoria[cat] || 0) + (item.precoVenda || 0) * (item.quantidade || 0);
        });
      }
    });

    const lucro = faturamentoTotal - totalInvestido;
    const margem = faturamentoTotal > 0 ? (lucro / faturamentoTotal) * 100 : 0;

    res.json({
      faturamentoTotal,
      totalInvestido,
      totalVendido,
      lucro,
      margem,
      porCategoria
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getSummary
};
