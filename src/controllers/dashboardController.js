const db = require("../database/firebase");

// ---------------------------------------------------------------
// SUMMARY GERAL DO SISTEMA (DASHBOARD PRINCIPAL)
// ---------------------------------------------------------------
async function getSummary(req, res) {
  try {
    const vendasSnap = await db.collection("vendas").get();
    const produtosSnap = await db.collection("produtos").get();

    let totalFaturado = 0;
    let totalVendido = 0;

    vendasSnap.forEach(doc => {
      const v = doc.data();
      if (v.status === "concluida") {
        totalFaturado += v.total;
        totalVendido += v.total;
      }
    });

    res.json({
      totalFaturado,
      totalVendido,
      produtosQtd: produtosSnap.size,
      vendasQtd: vendasSnap.size
    });

  } catch (err) {
    console.error("Erro em getSummary:", err);
    res.status(500).json({ error: err.message });
  }
}

// ---------------------------------------------------------------
// RESUMO POR PERÍODO (USADO EM RELATÓRIOS / REPORTS)
// ---------------------------------------------------------------
async function getSummaryByPeriod(req, res) {
  try {
    const { inicio, fim } = req.body;

    const start = new Date(inicio + "T00:00:00");
    const end = new Date(fim + "T23:59:59");

    const vendasSnap = await db.collection("vendas")
      .where("createdAt", ">=", start)
      .where("createdAt", "<=", end)
      .get();

    let faturamentoTotal = 0;
    let produtosVendidos = {};
    let categorias = {};

    vendasSnap.forEach(doc => {
      const v = doc.data();
      if (v.status !== "concluida") return;

      faturamentoTotal += v.total;

      v.itens.forEach(item => {
        // Totais por produto
        if (!produtosVendidos[item.produtoId]) {
          produtosVendidos[item.produtoId] = {
            nome: item.nome || "Produto",
            quantidade: 0,
            total: 0
          };
        }

        produtosVendidos[item.produtoId].quantidade += item.quantidade;
        produtosVendidos[item.produtoId].total += item.precoVenda * item.quantidade;

        // Totais por categoria
        const cat = item.categoriaId || "Sem categoria";
        categorias[cat] = (categorias[cat] || 0) + (item.precoVenda * item.quantidade);
      });
    });

    let faturamentoDias = {};

    vendasSnap.forEach(doc => {
      const v = doc.data();
      const d = v.createdAt.toDate().toLocaleDateString("pt-BR");
      faturamentoDias[d] = (faturamentoDias[d] || 0) + v.total;
    });

    const lucro = faturamentoTotal;
    const margem = faturamentoTotal > 0 ? (lucro / faturamentoTotal) * 100 : 0;

    res.json({
      faturamentoTotal,
      totalVendido: faturamentoTotal,
      lucro,
      margem,
      maisVendidos: Object.values(produtosVendidos).sort((a, b) => b.quantidade - a.quantidade),
      categorias,
      faturamentoDias
    });

  } catch (err) {
    console.error("Erro em getSummaryByPeriod:", err);
    res.status(500).json({ error: err.message });
  }
}

// ---------------------------------------------------------------
// EXPORTAR AS DUAS FUNÇÕES
// ---------------------------------------------------------------
module.exports = {
  getSummary,
  getSummaryByPeriod
};
