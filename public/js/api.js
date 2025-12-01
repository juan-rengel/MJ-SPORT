// /public/js/api.js

const API_BASE = '/api';

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error('Erro na requisição GET: ' + path);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // evita erro "Unexpected end of JSON input"
    data = { error: "Resposta inválida do servidor" };
  }

  if (!res.ok) {
    throw new Error(data.error || "Erro no servidor");
  }

  return data;
}


async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar');
  return data;
}

async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao excluir');
  return data;
}


document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await apiPost("/auth/login", { email, senha });

    localStorage.setItem("token", res.token);
    localStorage.setItem("usuario", JSON.stringify(res.usuario));

    window.location.href = "/pages/dashboard.html";

  } catch (err) {
    document.getElementById("msgErro").textContent =
      err.message || "Credenciais inválidas";
  }
});

