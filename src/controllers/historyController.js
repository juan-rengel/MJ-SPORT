const db = require("../database/firebase");

async function buscarMovimentos(req, res) {
  try {
    const { inicio, fim, tipo, produtoId } = req.body;

    let query = db.collection("estoque_movimentacoes");

    if (inicio) {
      query = query.where("createdAt", ">=", new Date(inicio + "T00:00:00"));
    }
    if (fim) {
      query = query.where("createdAt", "<=", new Date(fim + "T23:59:59"));
    }
    if (tipo) {
      query = query.where("tipo", "==", tipo);
    }
    if (produtoId) {
      query = query.where("produtoId", "==", produtoId);
    }

    const snap = await query.orderBy("createdAt", "desc").get();

    const produtosSnap = await db.collection("produtos").get();
    const produtosMap = {};
    produtosSnap.forEach(d => produtosMap[d.id] = d.data().nome);

    const movimentos = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      produtoNome: produtosMap[doc.data().produtoId] || "Produto removido"
    }));

    res.json(movimentos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  buscarMovimentos
};
