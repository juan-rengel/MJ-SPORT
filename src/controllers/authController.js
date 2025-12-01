const db = require("../database/firebase");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "MEU_SEGREDO_SUPER_SEGURO"; // mover para .env depois

// -------------------------------------------------------
// REGISTRAR USUÁRIO (admin) — AGORA SEM BCRYPT
// -------------------------------------------------------
async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const ref = await db.collection("usuarios").add({
      nome,
      email,
      senha, // senha pura
      perfil: "admin",
      createdAt: new Date()
    });

    res.json({ id: ref.id, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// -------------------------------------------------------
// LOGIN — AGORA 100% TEXTO PURO
// -------------------------------------------------------
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const snap = await db.collection("usuarios")
      .where("email", "==", email)
      .get();

    if (snap.empty) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    // VALIDAÇÃO SIMPLES
    if (senha !== user.senha) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id: userDoc.id,
        email: user.email,
        perfil: user.perfil
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      usuario: {
        id: userDoc.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// -------------------------------------------------------
// VALIDAR TOKEN
// -------------------------------------------------------
function autenticarToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) return res.status(401).json({ error: "Token ausente" });

  const token = header.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    req.user = user;
    next();
  });
}

module.exports = {
  register,
  login,
  autenticarToken
};
