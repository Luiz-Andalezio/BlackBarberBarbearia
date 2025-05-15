document.addEventListener("DOMContentLoaded", () => {
    console.log("Conta.js carregado.");
    const tipo = sessionStorage.getItem("tipo");
    const userInfo = document.getElementById("userInfo");
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (usuarioLogado && userInfo) {
        userInfo.innerHTML = `
            <p><strong>Email:</strong> ${usuarioLogado.email}</p>
            <p><strong>Tipo:</strong> ${usuarioLogado.tipo}</p>
        `;
    }

    document.getElementById("btnDeslogar").addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");

        console.log("Usuário deslogado.", usuarioLogado);

        if (tipo === "cliente") {
            window.location.href = "index.html";
        } else {
            window.location.href = "../login.html";
        }
    });
});
