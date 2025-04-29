const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "../../database/bbb.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao abrir banco:", err.message);
  else console.log("Conectado ao banco SQLite.");
});

// Rota de login
app.post("/login", (req, res) => {
  const { nome, email, senha, tipo, telefone } = req.body;
  console.log("Recebido no login:", req.body);

  if (!email || !senha || !tipo) {
    console.log("Tentativa de login com campos obrigatórios não preenchidos.");
    return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios não preenchidos." });
  }

  const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ? AND tipo = ?`;
  db.get(query, [email, senha, tipo], (err, row) => {
    if (err) {
      console.error("Erro no servidor ao tentar realizar login:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
    }

    if (row) {
      console.log(`Login bem-sucedido para o usuário: ${email}`);
      return res.json({ sucesso: true });
    } else {
      console.log(`Falha no login. Usuário não encontrado ou dados incorretos: ${email}`);
      res.json({ sucesso: false, mensagem: "Usuário não encontrado ou dados incorretos." });
    }
  });
});

// Rota de cadastro
app.post("/register", (req, res) => {
  const { nome, email, senha, tipo, telefone } = req.body;

  if (!nome || !email || !senha || !tipo) {
    console.log("Tentativa de cadastro com campos obrigatórios não preenchidos.");
    return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios." });
  }

  const query = `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`;
  db.run(query, [nome, email, senha, tipo], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        console.log(`Tentativa de cadastro com email já existente: ${email}`);
        return res.status(400).json({ sucesso: false, mensagem: "Email já cadastrado." });
      }
      console.error("Erro ao registrar usuário:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao registrar usuário." });
    }

    console.log(`Cadastro realizado com sucesso para o usuário: ${email}`);
    res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!" });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
