---

# 💈 Black Barber Barbearia

Projeto web baseado em um sistema de agendamento online para barbearias, focado na modernização da gestão de serviços e no aumento da satisfação do cliente.
Desenvolvido utilizando **HTML5**, **CSS3**, **JavaScript**, com backend em **Node.js** e banco de dados **SQLite**.

---

## 📋 Sobre o Projeto

O **Black Barber Web** nasce como um exemplo de solução para a necessidade de otimizar o agendamento de clientes em barbearias, eliminar conflitos de horário e proporcionar uma experiência de marca mais moderna.
Com um sistema simples e eficiente, profissionais poderão gerenciar serviços, horários e informações de clientes de forma ágil.

### 👥 Equipe do Projeto

| Nome                        | Função                                   |
| --------------------------- | ---------------------------------------- |
| Luiz Alberto Cury Andalécio | Programador                              |
| Gabriel Lucas Silva Seabra  | Programador                              |
| Julio Cesar Tonelini        | Programador                              |
| Camilo de Lelis Tosta Paula | Professor Orientador                     |

### 🎯 Funcionalidades Principais

* Agendamento online de cortes de cabelo.
* Cadastro e login de usuários com segurança.
* Área do cliente: histórico de agendamentos.
* Área do barbeiro: gestão de agendamentos e controle de informações institucionais.

### 🛠️ Tecnologias Utilizadas

* **Frontend**:

  * HTML5
  * CSS3
  * JavaScript
* **Backend**:

  * Node.js
  * Express.js (futuro planejamento)
  * SQLite (via SQL.js)
* **Outros**:

  * TypeScript (parcial)
  * Bcrypt (criptografia de senhas)
  * Nodemon (para hot reload no desenvolvimento)

### 📁 Estrutura do Projeto

* `data/` – Arquivos json para armazenar dados de objetos.
* `database/` – Arquivos e configurações SQLite para armazenar dados dos usuários.
* `docs/` – Exemplos de documentação do projeto em pdf.
* `src/` – Páginas HTML que compõem a interface, folhas de estilo CSS, códigos-fonte JavaScript e TypeScript.
* `static/` – Imagens, ícones, protótipos, referências de design e demais arquivos estáticos.

---

## 📈 Status do Projeto

> **Progresso atual**: 80% (Prototipado em ambiente local).

> **Próximos passos**: Verificações de ações, tabela com histórico de agendamentos do usuário, edição de informações da conta.

---

## ⚙️ Como rodar localmente

1. Abra o projeto no **Visual Studio Code**.
2. Instale a extensão **Live Server** para rodar páginas HTML localmente.
3. Instale as dependências necessárias no seu sistema:

   ```bash
   sudo apt install nodejs npm
   sudo npm install
   sudo npm install -g nodemon
   sudo apt install node-typescript
   npm install bcrypt
   ```
4. No terminal, acesse a pasta raiz do projeto e execute:

   ```bash
   npm start
   ```
5. Para visualizar a aplicação, clique com o botão direito no arquivo `src/html/index.html` e selecione **Open with Live Server**.

---

# 📓 Padrão de Commits

Este repositório tenta seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/), com o objetivo de manter um histórico de commits organizado, legível e propício à automação de versões e changelogs.

### ✔️ Formato

```bash
<tipo>(escopo):<ENTER>
<mensagem breve sobre o que o commit faz>
```

### 🔧 Tipos mais comuns

- `feat`: Nova funcionalidade
- `fix`: Correção de bugs
- `docs`: Alterações na documentação
- `style`: Ajustes de estilização (css, cores, imagens, etc.)
- `refactor`: Refatoração de código sem mudança de comportamento (indentação, reposicionamento de funções ou arquivos...)
- `perf`: Melhorias de performance
- `test`: Criação ou modificação de testes
- `build`: Mudanças que afetam o build (dependências, scripts)
- `ci`: Configurações de integração contínua

### 📍 Escopo

Define o título do commit referente a parte do projeto afetada, como um módulo (`cryptography`), uma página (`login-page`), ou uma feature (`carousel`).

### 📝 Exemplo

```bash
git commit -am "refactor(cryptography):
> Aprimora a indentação."

git commit -am "fix(login-page):
> Corrige bug de login nulo."

git commit -am "feat(carousel):
> Implementa o carrossel na página inicial."
```

---