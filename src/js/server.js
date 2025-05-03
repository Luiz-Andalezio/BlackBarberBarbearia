//Login e Cadastro
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

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
  const { email, senha, tipo } = req.body;

  if (!email || !senha || !tipo) {
    console.log("Tentativa de login com campos obrigatórios não preenchidos.");
    return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios não preenchidos." });
  }

  const query = `SELECT * FROM usuarios WHERE email = ? AND tipo = ?`;
  db.get(query, [email, tipo], async (err, row) => {
    if (err) {
      console.error("Erro no servidor ao tentar realizar login:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
    }

    if (!row) {
      console.log(`Falha no login. Usuário não encontrado com email: ${email}`);
      return res.json({ sucesso: false, mensagem: "Usuário não encontrado ou dados incorretos." });
    }

    const senhaCorreta = await bcrypt.compare(senha, row.senha);
    if (senhaCorreta) {
      console.log(`Login bem-sucedido para o usuário: ${email}`);
      return res.json({ sucesso: true });
    } else {
      console.log(`Senha incorreta para o usuário: ${email}`);
      return res.json({ sucesso: false, mensagem: "Usuário não encontrado ou dados incorretos." });
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

  const verificarEmailQuery = `SELECT * FROM usuarios WHERE email = ? AND tipo = ?`;
  db.get(verificarEmailQuery, [email, tipo], async (err, row) => {
    if (err) {
      console.error("Erro ao verificar email existente:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
    }

    if (row) {
      console.log(`Tentativa de cadastro com email já existente: ${email}`);
      return res.status(400).json({ sucesso: false, mensagem: "Email já cadastrado." });
    }

    try {
      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
      const insertQuery = `INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES (?, ?, ?, ?, ?)`;
      db.run(insertQuery, [nome, email, senhaHash, tipo, telefone], function (err) {
        if (err) {
          console.error("Erro ao registrar usuário:", err.message);
          return res.status(500).json({ sucesso: false, mensagem: "Erro ao registrar usuário." });
        }

        console.log(`Cadastro realizado com sucesso para o usuário: ${email}`);
        return res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!" });
      });
    } catch (hashError) {
      console.error("Erro ao criptografar senha:", hashError.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a senha." });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//Infos
const fs = require("fs");

const infoPath = path.join(__dirname, "../../data/info.json");

// Rota para obter dados da home
app.get("/api/info", (req, res) => {
  fs.readFile(infoPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler info.json:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar informações." });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error("Erro ao parsear info.json:", parseErr.message);
      res.status(500).json({ sucesso: false, mensagem: "Erro ao processar informações." });
    }
  });
});

// Rota para salvar dados da home
app.post("/api/info", (req, res) => {
  const novoConteudo = JSON.stringify(req.body, null, 2);

  fs.writeFile(infoPath, novoConteudo, "utf-8", (err) => {
    if (err) {
      console.error("Erro ao salvar info.json:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar informações." });
    }

    console.log("info.json atualizado com sucesso.");
    res.sendStatus(200);
  });
});
