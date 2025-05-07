document.addEventListener("DOMContentLoaded", function () {
    const servicesContainer = document.getElementById("services-container");
    const modalLogin = document.getElementById("login-modal");
    const btnLogin = document.getElementById("login-button");
    const btnCancelar = document.getElementById("later-button");
    const closeModal = document.getElementById("close-login-modal");

    fetch("http://localhost:3000/api/servicos")
        .then(res => res.json())
        .then(servicos => {
            servicesContainer.innerHTML = "";

            servicos.forEach(servico => {
                const item = document.createElement("div");
                item.className = "service-item";

                item.innerHTML = `
                    <div class="service-info">
                        <span class="service-name">${servico.nome}</span>
                        <span class="service-price">R$ ${servico.preco},00</span>
                        <span class="service-time">${servico.tempo} min</span>
                    </div>
                    <button class="schedule-button" data-id="${servico.id}">Agendar</button>
                `;

                servicesContainer.appendChild(item);
            });

            const botoes = document.querySelectorAll(".schedule-button");
            botoes.forEach(botao => {
                botao.addEventListener("click", () => {
                    if (!isUserLoggedIn()) {
                        modalLogin.style.display = "flex";
                    } else {
                        console.log("Usuário logado - abrir próxima etapa de agendamento.");
                    }
                });
            });
        })
        .catch(err => {
            console.error("Erro ao carregar serviços:", err);
            servicesContainer.innerHTML = "<p>Erro ao carregar serviços.</p>";
        });

    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    if (btnCancelar || closeModal) {
        [btnCancelar, closeModal].forEach(el => {
            if (el) {
                el.addEventListener("click", () => {
                    modalLogin.style.display = "none";
                });
            }
        });
    }
});

function isUserLoggedIn() {
    return sessionStorage.getItem("usuarioLogado") !== null;
}
