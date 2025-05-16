// session.ts
document.addEventListener("DOMContentLoaded", function () {
    var loginBtn = document.getElementById("loginBtn");
    var usuarioLogado = sessionStorage.getItem("usuarioLogado");
    var tipo = sessionStorage.getItem("tipo");

    console.log("Usuário logado:", usuarioLogado);
    console.log("Elemento loginBtn:", loginBtn);

    if (usuarioLogado && loginBtn && tipo === "cliente") {
        loginBtn.textContent = "Conta";
        loginBtn.setAttribute("href", "contaUsuario.html");
    }
    else if (usuarioLogado && loginBtn && tipo === "barbeiro") {
        loginBtn.textContent = "Conta Barbeiro";
        loginBtn.setAttribute("href", "contaBarbeiro.html");
    }
});
