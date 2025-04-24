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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (actionSelect.value === "login") {
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();
            const tipo = document.getElementById("role").value;

            if (!email || !senha || !tipo) return alert("Preencha todos os campos!");

            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha, tipo })
            });

            const data = await res.json();

            if (data.sucesso) {
                console.log("Login bem-sucedido para o usuário:", email);
                window.location.href = "../html/index.html";
            } else {
                console.log("Falha no login para o usuário:", email, "Mensagem:", data.mensagem || "Credenciais inválidas!");
                alert(data.mensagem || "Credenciais inválidas!");
            }

        } else if (actionSelect.value === "register") {
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
            
            console.log("Enviando login:", { email, senha, tipo });

            const res = await fetch("http://localhost:3000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, senha, tipo })
            });
            
            console.log("Resposta bruta:", res);
            const data = await res.json();
            console.log("Resposta JSON:", data);
            
            alert(data.mensagem);

            if (data.sucesso) {
                console.log("Cadastro bem-sucedido para o usuário:", email);
                window.location.href = "../html/index.html";
            } else {
                console.log("Falha no cadastro para o usuário:", email, "Mensagem:", data.mensagem);
            }
        }
    });
});