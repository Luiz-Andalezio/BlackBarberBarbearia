document.addEventListener("DOMContentLoaded", () => {
    const actionSelect = document.getElementById("action");
    const loginFields = document.getElementById("loginFields");
    const registerFields = document.getElementById("registerFields");
    const form = document.getElementById("loginForm");

    // Alternar entre login e cadastro
    actionSelect.addEventListener("change", () => {
        if (actionSelect.value === "login") {
            loginFields.style.display = "block";
            registerFields.style.display = "none";
        } else {
            loginFields.style.display = "none";
            registerFields.style.display = "block";
        }
    });

    // Mostrar campos de login por padrão
    loginFields.style.display = "block";
    registerFields.style.display = "none";

    document.getElementById("btnLogin").addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const tipo = document.getElementById("role").value;

        if (!email || !senha || !tipo) return alert("Preencha todos os campos!");

        console.log("Tentando login com:", { email, senha, tipo });

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha, tipo })
        });

        const data = await res.json();
        console.log("Resposta do servidor:", data);

        if (data.sucesso) {
            const usuario = {
                email: email,
                tipo: tipo
            };
            sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            sessionStorage.setItem("tipo", tipo);
            if (tipo === "cliente") {
                window.location.href = "../html/user/index.html";
            } else {
                window.location.href = "../html/admin/agenda.html";
            }
        } else {
            alert(data.mensagem || "Credenciais inválidas!");
        }
    });

    document.getElementById("btnRegister").addEventListener("click", async () => {
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
            body: JSON.stringify({ nome, email, senha, tipo: "cliente", telefone })
        });

        const data = await res.json();
        alert(data.mensagem);

        if (data.sucesso) {
            if (tipo === "cliente") {
                window.location.href = "../html/user/index.html";
            } else {
                window.location.href = "../html/admin/agenda.html";
            }
        }
    });
});