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

// Rota do banco de dados
const dbPath = path.join(__dirname, "../../data/db/bbb.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao abrir banco:", err.message);
  else console.log("Conectado ao banco SQLite.");
});

// ===== ROTAS DE LOGIN E CADASTRO =====

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
      console.log(`Login bem-sucedido para o usuário de nome ${row.nome} e email ${email}`);
      return res.json({ sucesso: true, id: row.id, nome: row.nome, tipo: row.tipo, email: row.email });
    } else {
      console.log(`Senha incorreta para o usuáriode nome ${row.nome} e email ${email}`);
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
        return res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!", id: this.lastID });
      });
    } catch (hashError) {
      console.error("Erro ao criptografar senha:", hashError.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a senha." });
    }
  });
});

// ===== ROTAS DE USUÁRIOS =====

// Buscar dados do usuário pelo ID
app.get("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT id, nome, email, tipo, telefone FROM usuarios WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar usuário." });
    if (!row) return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
    res.json(row);
  });
});

// Atualizar dados do usuário (nome, email, telefone)
app.put("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;
  db.run(
    "UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?",
    [nome, email, telefone, id],
    function (err) {
      if (err) return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar usuário." });
      res.json({ sucesso: true, mensagem: "Dados atualizados com sucesso." });
    }
  );
});

// Alterar senha do usuário
app.put("/api/usuario/:id/senha", async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;
  db.get("SELECT senha FROM usuarios WHERE id = ?", [id], async (err, row) => {
    if (err || !row) return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado." });
    const senhaCorreta = await bcrypt.compare(senhaAtual, row.senha);
    if (!senhaCorreta) return res.status(400).json({ sucesso: false, mensagem: "Senha atual incorreta." });
    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
    db.run("UPDATE usuarios SET senha = ? WHERE id = ?", [novaSenhaHash, id], function (err) {
      if (err) return res.status(500).json({ sucesso: false, mensagem: "Erro ao alterar senha." });
      res.json({ sucesso: true, mensagem: "Senha alterada com sucesso." });
    });
  });
});

// Excluir conta do usuário
app.delete("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuarios WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir conta." });
    res.json({ sucesso: true, mensagem: "Conta excluída com sucesso." });
  });
});

// ===== ROTAS DE INFORMAÇÕES DA HOME =====

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

// ===== ROTAS DE SERVIÇOS =====

// Caminhos dos arquivos
const servicosPath = path.join(__dirname, "../../data/servicos.json");
const agendamentosPath = path.join(__dirname, "../../data/agendamentos.json");

// Buscar serviços
app.get("/api/servicos", (req, res) => {
  fs.readFile(servicosPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler serviços:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao ler serviços." });
    }
    res.json(JSON.parse(data));
  });
});

// Criar novo serviço
app.post("/api/servicos", (req, res) => {
  const { nome, preco, duracao } = req.body;
  if (!nome || !preco || !duracao) {
    return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios." });
  }

  let servicos = [];
  if (fs.existsSync(servicosPath)) {
    servicos = JSON.parse(fs.readFileSync(servicosPath, "utf8"));
  }

  const novoServico = { id: Date.now(), nome, preco, duracao };
  servicos.push(novoServico);

  fs.writeFileSync(servicosPath, JSON.stringify(servicos, null, 2));
  res.json({ sucesso: true, mensagem: "Serviço criado." });
});

// Atualizar serviços
app.put("/api/servicos", (req, res) => {
  const { servicos } = req.body;
  if (!Array.isArray(servicos)) {
    return res.status(400).json({ sucesso: false, mensagem: "Formato inválido de serviços." });
  }

  fs.writeFileSync(servicosPath, JSON.stringify(servicos, null, 2));
  res.json({ sucesso: true, mensagem: "Serviços atualizados." });
});

// ===== ROTAS DE AGENDAMENTOS =====

// Buscar barbeiros (usuários que possuem o tipo = "barbeiro")
app.get("/api/barbeiros", (req, res) => {
  const query = `SELECT id, nome FROM usuarios WHERE tipo = 'barbeiro'`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar barbeiros:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar barbeiros." });
    }
    res.json(rows);
  });
});

// Buscar todos os agendamentos
app.get("/api/agendamentos", (req, res) => {
  fs.readFile(agendamentosPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler agendamentos:", err.message);
      return res.status(500).json({ sucesso: false, mensagem: "Erro ao ler agendamentos." });
    }

    try {
      const agendamentos = JSON.parse(data);
      res.json(agendamentos);
    } catch (e) {
      console.error("Erro ao parsear agendamentos:", e.message);
      res.status(500).json({ sucesso: false, mensagem: "Erro no formato de agendamentos." });
    }
  });
});

// Agendar serviço
app.post("/api/agendamentos", (req, res) => {
  const { usuario, servico, barbeiro, data, horario } = req.body;

  if (!usuario || !servico || !barbeiro || !data || !horario) {
    return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios." });
  }
  
  let idCliente = 0;
  let nomeCliente = "";
  let precoServico = 0;
  try {
    const usuarioObj = JSON.parse(usuario);
    idCliente = usuarioObj.id;
    nomeCliente = usuarioObj.nome;
  } catch {
    nomeCliente = usuario;
  }

  let servicos = [];
  if (fs.existsSync(servicosPath)) {
    servicos = JSON.parse(fs.readFileSync(servicosPath, "utf8"));
  }
  const servicoObj = servicos.find(s => s.nome === servico);
  if (servicoObj) precoServico = servicoObj.preco;

  let agendamentos = [];
  if (fs.existsSync(agendamentosPath)) {
    agendamentos = JSON.parse(fs.readFileSync(agendamentosPath, "utf8"));
  }

  const novoAgendamento = {
    idAgendamento: Date.now(),
    idCliente: idCliente,
    nomeCliente: nomeCliente,
    servico,
    preco: precoServico,
    barbeiro,
    data,
    horario,
    estado: "Agendado",
    canceladoCliente: false
  };

  agendamentos.push(novoAgendamento);

  fs.writeFileSync(agendamentosPath, JSON.stringify(agendamentos, null, 2));
  res.json({ sucesso: true, mensagem: "Agendamento criado com sucesso." });
});

app.put("/api/agendamentos/:id/estado", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  let agendamentos = [];
  if (fs.existsSync(agendamentosPath)) {
    agendamentos = JSON.parse(fs.readFileSync(agendamentosPath, "utf8"));
  }

  const index = agendamentos.findIndex(a => String(a.idAgendamento) === String(id));
  if (index === -1) {
    return res.status(404).json({ erro: "Agendamento não encontrado" });
  }

  agendamentos[index].estado = estado;
  fs.writeFileSync(agendamentosPath, JSON.stringify(agendamentos, null, 2));
  res.json({ sucesso: true, mensagem: "Estado atualizado com sucesso." });
});

app.put("/api/agendamentos/:id/cancelar-cliente", (req, res) => {
  const { id } = req.params;
  let agendamentos = [];
  if (fs.existsSync(agendamentosPath)) {
    agendamentos = JSON.parse(fs.readFileSync(agendamentosPath, "utf8"));
  }
  const index = agendamentos.findIndex(a => String(a.idAgendamento) === String(id));
  if (index === -1) {
    return res.status(404).json({ erro: "Agendamento não encontrado" });
  }
  agendamentos[index].canceladoCliente = true;
  agendamentos[index].estado = "Cancelado pelo cliente";
  fs.writeFileSync(agendamentosPath, JSON.stringify(agendamentos, null, 2));
  res.json({ sucesso: true, mensagem: "Agendamento cancelado pelo cliente." });
});

// ===== ROTAS DE ARQUIVOS ESTÁTICOS E BUILD =====

app.use('/static', express.static(path.join(__dirname, '../../static')));

// Rotas HTML principais
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/user/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/login.html'));
});

app.get('/agendar', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/user/agendar.html'));
});

app.get('/conta', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/user/contaUsuario.html'));
});

app.get('/user/:file', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/user', req.params.file));
});

app.get('/admin/:file', (req, res) => {
  res.sendFile(path.join(__dirname, '../../templates/admin', req.params.file));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});