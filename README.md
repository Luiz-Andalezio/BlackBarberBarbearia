---

# 💈 Black Barber Web

Sistema de agendamento online para barbearia, desenvolvido com **HTML**, **CSS** e **JavaScript**, com backend em **Node.js** e banco de dados **SQLite**.

---

## 📁 Estrutura do Projeto

- `src/` – Código-fonte JavaScript e folhas de estilo CSS.
- `static/` – Recursos estáticos como imagens e ícones.
- `templates/` – Páginas HTML da aplicação.
- `database/` – Arquivos SQLite utilizados no backend.
- `figma/` – Prototipação e referências visuais.

---

## 🚀 Como rodar localmente

1. Abra o projeto no Visual Studio Code.
2. Instale a extensão **Live Server**.
3. Instale as dependências necessárias:
   ```bash
   sudo apt install nodejs npm
   sudo npm install
   sudo npm install -g nodemon
   sudo apt install node-typescript
   npm install bcrypt
   ```
4. Entre no diretório principal do projeto via terminal e rode `npm start`.
5. Clique com o botão direito em `src/html/index.html` e acione o **Live Server**.

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- TypeScript
- Node.js
- SQLite (via SQL.js)
- Bcrypt (criptografia de senhas)

---

## 📓 Padrão de Commits

Este repositório tenta seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/), com o objetivo de manter um histórico de commits organizado, legível e propício à automação de versões e changelogs.

### ✔️ Formato

```bash
<tipo>(escopo): <mensagem breve sobre o que o commit faz>
<!-- Observação, é necessário dar um <ENTER> após os dois pontos da definição do escopo. -->
```

### 🔧 Tipos mais comuns

- `feat`: Nova funcionalidade
- `fix`: Correção de bugs
- `docs`: Alterações na documentação
- `style`: Ajustes de estilo (espaçamento, ponto e vírgula, imagens, etc.)
- `refactor`: Refatoração de código (sem mudança de comportamento)
- `perf`: Melhorias de performance
- `test`: Criação ou modificação de testes
- `build`: Mudanças que afetam o build (dependências, scripts)
- `ci`: Configurações de integração contínua

### 📍 Escopo

Define o título do commit referente a parte do projeto afetada, como um módulo (`cryptography`), uma página (`login-page`), ou uma feature (`carousel`).

### 📝 Exemplo

```bash
feat(cryptography): Adiciona verificação de senha com bcrypt.
fix(login-page): Corrige bug de login nulo.
style(carousel): Atualiza a identação.
```

---