// /public/js/dashboard.js

async function loadDashboard() {
  try {
    const resumo = await apiGet('/dashboard/resumo');
    document.getElementById('fat-total').textContent =
      formatCurrency(resumo.faturamentoTotal);
    document.getElementById('total-investido').textContent =
      formatCurrency(resumo.totalInvestido);
    document.getElementById('lucro-liquido').textContent =
      formatCurrency(resumo.lucro);
    document.getElementById('margem-lucro').textContent =
      `Margem ${resumo.margem.toFixed(1)}%`;

    const baixoEstoque = await apiGet('/estoque/baixo-estoque');
    document.getElementById('baixo-estoque-count').textContent =
      baixoEstoque.length;

    renderCategoriasChart(resumo.porCategoria || {});
  } catch (err) {
    console.error(err);
  }
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function renderCategoriasChart(porCategoria) {
  const ctx = document.getElementById('chartCategorias');
  const labels = Object.keys(porCategoria);
  const data = Object.values(porCategoria);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Faturamento (R$)',
          data
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' } },
        y: { ticks: { color: '#9ca3af' } }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
