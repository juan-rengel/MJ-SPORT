console.log("LOGIN.JS FOI CARREGADO!");



document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");

  if (!form) {
    console.error("ERRO: formLogin não encontrado no DOM");
    return;
  }

  form.addEventListener("submit", async (e) => {
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
        err.error || "Credenciais inválidas";
    }
  });

});
