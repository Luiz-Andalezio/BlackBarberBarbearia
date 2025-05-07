document.addEventListener("DOMContentLoaded", function () {
    const servicosLista = document.getElementById("servicos-lista");
    const modalLogin = document.getElementById("modal-login");
    const btnLogin = document.getElementById("btn-login");
    const btnCancelar = document.getElementById("btn-cancelar");

    fetch("http://localhost:3000/api/servicos")
        .then(res => res.json())
        .then(servicos => {
            if (servicosLista) {
                servicosLista.innerHTML = "";

                servicos.forEach(servico => {
                    const linha = document.createElement("tr");

                    linha.innerHTML = `
                        <td>${servico.nome}</td>
                        <td>R$ ${servico.preco},00</td>
                        <td>${servico.tempo} min</td>
                        <td><button class="btn-agendar" data-id="${servico.id}">Agendar</button></td>
                    `;

                    servicosLista.appendChild(linha);
                });

                const botoesAgendar = document.querySelectorAll(".btn-agendar");

                botoesAgendar.forEach(botao => {
                    botao.addEventListener("click", function () {
                        if (!isUserLoggedIn()) {
                            if (modalLogin) modalLogin.style.display = "block";
                        } else {
                            console.log("Usuário logado, prosseguindo para agendamento...");
                        }
                    });
                });
            }
        })
        .catch(err => {
            console.error("Erro ao carregar serviços:", err);
            if (servicosLista) {
                servicosLista.innerHTML = "<tr><td colspan='4'>Erro ao carregar serviços.</td></tr>";
            }
        });

    if (btnLogin) {
        btnLogin.addEventListener("click", function () {
            window.location.href = "login.html";
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            if (modalLogin) modalLogin.style.display = "none";
        });
    }
});

function isUserLoggedIn() {
    return sessionStorage.getItem('usuarioLogado') !== null;
}
