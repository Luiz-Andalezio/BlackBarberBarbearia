// session.ts
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const usuarioLogado = sessionStorage.getItem("usuarioLogado");
  const tipo = sessionStorage.getItem("tipo");
  
  console.log("Usuário logado:", usuarioLogado);
  console.log("Elemento loginBtn:", loginBtn);

  if (usuarioLogado && loginBtn && tipo === "cliente") {
      loginBtn.textContent = "Conta";
      loginBtn.setAttribute("href", "user/contaUsuario.html");
  } else if (usuarioLogado && loginBtn && tipo === "barbeiro") {
      loginBtn.textContent = "Conta Barbeiro";
      loginBtn.setAttribute("href", "admin/contaBarbeiro.html");
  }
});
