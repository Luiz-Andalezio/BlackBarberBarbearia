document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("auth-container");

    function renderLogin() {
        container.innerHTML = `
            <h1 class="rye-regular">Black Barber</h1>
            <form id="loginForm">
                <h2 id="signTypeText">Login:</h2>
                <input type="email" id="email" placeholder="Digite seu e-mail..." required>
                <input type="password" id="senha" placeholder="Digite sua senha..." required>
                <button type="submit" id="btnLogin">Entrar</button>
            </form>
            <div style="text-align:center; margin-top:20px;">
                Não possui uma conta? <a href="#" id="linkCadastro" style="color:#FFD700;">Cadastre-se</a>
            </div>
        `;

        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!email || !senha) return alert("Preencha todos os campos!");

            // Tenta login como cliente
            let res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha, tipo: "cliente" })
            });
            let data = await res.json();

            // Se não for cliente, tenta barbeiro
            if (!data.sucesso) {
                res = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha, tipo: "barbeiro" })
                });
                data = await res.json();
            }

            if (data.sucesso) {
                const usuario = {
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    tipo: data.tipo
                };
                sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                sessionStorage.setItem("tipo", data.tipo);
                if (data.tipo === "cliente") {
                    window.location.href = "/user/index.html";
                } else {
                    window.location.href = "/admin/agenda.html";
                }
            } else {
                alert(data.mensagem || "Credenciais inválidas!");
            }
        });

        document.getElementById("linkCadastro").onclick = (e) => {
            e.preventDefault();
            renderCadastro();
        };
    }

    function renderCadastro() {
        container.innerHTML = `
            <h1 class="rye-regular">Black Barber</h1>
            <form id="registerForm">
                <h2 id="signTypeText">Cadastro:</h2>
                <input type="text" id="nome" placeholder="Digite seu nome..." required>
                <input type="email" id="emailRegister" placeholder="Digite seu e-mail..." required>
                <input type="text" id="telefone" placeholder="Digite seu telefone..." required>
                <input type="password" id="senhaRegister" placeholder="Digite sua senha..." required>
                <input type="password" id="confirmarSenha" placeholder="Confirme sua senha..." required>
                <button type="submit" id="btnRegister">Cadastrar</button>
            </form>
            <div style="text-align:center; margin-top:20px;">
                Possui uma conta? <a href="#" id="linkLogin" style="color:#FFD700;">Logue</a>
            </div>
        `;

        document.getElementById("registerForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("nome").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const email = document.getElementById("emailRegister").value.trim();
            const senha = document.getElementById("senhaRegister").value.trim();
            const confirmar = document.getElementById("confirmarSenha").value.trim();

            if (!nome || !telefone || !email || !senha || !confirmar) {
                return alert("Preencha todos os campos!");
            }
            if (senha !== confirmar) {
                return alert("As senhas não coincidem!");
            }

            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha, telefone, tipo: "cliente" })
            });

            const data = await res.json();
            alert(data.mensagem);

            if (data.sucesso) {
                const usuario = {
                    id: data.id,
                    nome,
                    email,
                    telefone,
                    tipo: "cliente"
                };
                sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                sessionStorage.setItem("tipo", "cliente");
                window.location.href = "/user/index.html";
            }
        });

        document.getElementById("linkLogin").onclick = (e) => {
            e.preventDefault();
            renderLogin();
        };
    }

    renderLogin();
});