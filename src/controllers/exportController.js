const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../database/firebase");

// ====================================================
// EXPORTAR PRODUTOS EM EXCEL
// ====================================================
async function exportarProdutosExcel(req, res) {
  try {
    const snap = await db.collection("produtos").get();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Produtos");

    sheet.columns = [
      { header: "Nome", key: "nome", width: 30 },
      { header: "Categoria", key: "categoria", width: 20 },
      { header: "Preço Compra", key: "compra", width: 15 },
      { header: "Preço Venda", key: "venda", width: 15 },
      { header: "Estoque", key: "estoque", width: 10 },
      { header: "Estoque Mínimo", key: "min", width: 15 },
      { header: "SKU", key: "sku", width: 15 }
    ];

    snap.forEach(doc => {
      const p = doc.data();
      sheet.addRow({
        nome: p.nome,
        categoria: p.categoriaId || "—",
        compra: p.precoCompra,
        venda: p.precoVenda,
        estoque: p.estoqueAtual,
        min: p.estoqueMinimo,
        sku: p.sku
      });
    });

    const file = path.join(__dirname, "../../exports/produtos.xlsx");
    await workbook.xlsx.writeFile(file);

    res.download(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ====================================================
// EXPORTAR VENDAS EM EXCEL
// ====================================================
async function exportarVendasExcel(req, res) {
  try {
    const snap = await db.collection("vendas").get();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vendas");

    sheet.columns = [
      { header: "ID Venda", key: "id", width: 25 },
      { header: "Data", key: "data", width: 20 },
      { header: "Total", key: "total", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    snap.forEach(doc => {
      const v = doc.data();
      const data = v.createdAt ? v.createdAt.toDate().toLocaleString() : "—";

      sheet.addRow({
        id: doc.id,
        data,
        total: v.total,
        status: v.status
      });
    });

    const file = path.join(__dirname, "../../exports/vendas.xlsx");
    await workbook.xlsx.writeFile(file);

    res.download(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ====================================================
// EXPORTAR MOVIMENTAÇÕES EM EXCEL
// ====================================================
async function exportarMovimentosExcel(req, res) {
  try {
    const snap = await db.collection("estoque_movimentacoes").get();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Movimentações");

    sheet.columns = [
      { header: "Data", key: "data", width: 20 },
      { header: "Produto", key: "produto", width: 25 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Quantidade", key: "qtd", width: 10 },
      { header: "Origem", key: "origem", width: 20 }
    ];

    snap.forEach(doc => {
      const m = doc.data();
      const data = m.createdAt ? m.createdAt.toDate().toLocaleString() : "—";

      sheet.addRow({
        data,
        produto: m.produtoId,
        tipo: m.tipo,
        qtd: m.quantidade,
        origem: m.origem
      });
    });

    const file = path.join(__dirname, "../../exports/movimentacoes.xlsx");
    await workbook.xlsx.writeFile(file);

    res.download(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ====================================================
// EXPORTAR RELATÓRIO PDF
// ====================================================
async function exportarRelatorioPDF(req, res) {
  try {
    const { titulo, dados } = req.body;

    const file = path.join(__dirname, "../../exports/relatorio.pdf");
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(file));

    doc.fontSize(22).text(titulo || "Relatório", { underline: true });
    doc.moveDown(2);

    doc.fontSize(14);

    for (const key in dados) {
      doc.text(`${key}: ${dados[key]}`);
      doc.moveDown(0.5);
    }

    doc.end();

    setTimeout(() => {
      res.download(file);
    }, 500);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  exportarProdutosExcel,
  exportarVendasExcel,
  exportarMovimentosExcel,
  exportarRelatorioPDF
};
