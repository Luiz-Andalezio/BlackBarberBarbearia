let barbeiroSelecionado = null;
let dataSelecionada = null;
let horarioSelecionado = null;
let servicoSelecionado = null;

document.addEventListener("DOMContentLoaded", function () {
    const servicesContainer = document.getElementById("services-container");
    const modalLogin = document.getElementById("login-modal");
    const modalAgendamento = document.getElementById("agendamento-modal");
    const btnConfirmarAgendamento = document.getElementById("confirmar-agendamento");

    const btnLogin = document.getElementById("login-button");
    const btnCancelar = document.getElementById("later-button");
    const closeLoginModal = document.getElementById("close-login-modal");
    const closeAgendamentoModal = document.getElementById("close-agendamento-modal");

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
                    <button class="schedule-button" data-id="${servico.id}" data-nome="${servico.nome}">Agendar</button>
                `;

                servicesContainer.appendChild(item);
            });

            const botoes = document.querySelectorAll(".schedule-button");
            botoes.forEach(botao => {
                botao.addEventListener("click", (e) => {
                    if (!isUserLoggedIn()) {
                        modalLogin.style.display = "flex";
                    } else {
                        // Guardar serviço escolhido
                        servicoSelecionado = e.currentTarget.getAttribute("data-nome");
                        modalAgendamento.style.display = "flex";
                        carregarBarbeiros();
                        gerarCalendario();
                        resetarSelecoes();
                    }
                });
            });
        })
        .catch(err => {
            console.error("Erro ao carregar serviços:", err);
            servicesContainer.innerHTML = "<p>Erro ao carregar serviços.</p>";
        });

    if (btnLogin) btnLogin.addEventListener("click", () => window.location.href = "login.html");
    if (btnCancelar || closeLoginModal) {
        [btnCancelar, closeLoginModal].forEach(el => {
            if (el) el.addEventListener("click", () => modalLogin.style.display = "none");
        });
    }
    if (closeAgendamentoModal) {
        closeAgendamentoModal.addEventListener("click", () => modalAgendamento.style.display = "none");
    }

    btnConfirmarAgendamento.addEventListener("click", confirmarAgendamento);

    function resetarSelecoes() {
        barbeiroSelecionado = null;
        dataSelecionada = null;
        horarioSelecionado = null;
        btnConfirmarAgendamento.classList.remove("active");
    }

    function carregarBarbeiros() {
        fetch("http://localhost:3000/api/barbeiros")
            .then(res => res.json())
            .then(barbeiros => {
                const container = document.getElementById("barbeiros-container");
                container.innerHTML = "";

                barbeiros.forEach(barbeiro => {
                    const btn = document.createElement("button");
                    btn.innerText = barbeiro.nome;
                    btn.onclick = () => {
                        document.querySelectorAll("#barbeiros-container button").forEach(b => b.classList.remove("selected"));
                        btn.classList.add("selected");
                        barbeiroSelecionado = barbeiro.nome;
                        carregarHorarios();
                        verificarHabilitarConfirmar();
                    };
                    container.appendChild(btn);
                });
            })
            .catch(err => console.error("Erro ao carregar barbeiros:", err));
    }

    function gerarCalendario() {
        const calendario = document.getElementById("calendar-carousel");
        calendario.innerHTML = "";

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const botao = document.createElement("button");
            botao.className = "dia-button";
            botao.innerText = dia;
            botao.onclick = () => {
                document.querySelectorAll("#calendar-carousel button").forEach(b => b.classList.remove("selected"));
                botao.classList.add("selected");
                dataSelecionada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                carregarHorarios();
                verificarHabilitarConfirmar();
            };
            calendario.appendChild(botao);
        }
    }

    function carregarHorarios() {
        if (!barbeiroSelecionado || !dataSelecionada) return;

        const horariosContainer = document.getElementById("horarios-container");
        horariosContainer.innerHTML = "";

        const horarios = [];
        for (let h = 8; h <= 18; h++) {
            horarios.push(`${String(h).padStart(2, '0')}:00`);
        }

        horarios.forEach(horario => {
            const btn = document.createElement("button");
            btn.innerText = horario;
            btn.onclick = () => {
                document.querySelectorAll("#horarios-container button").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                horarioSelecionado = horario;
                verificarHabilitarConfirmar();
            };
            horariosContainer.appendChild(btn);
        });

        // No futuro: buscar `agendamentos.json` para bloquear horários já ocupados
    }

    function verificarHabilitarConfirmar() {
        if (barbeiroSelecionado && dataSelecionada && horarioSelecionado) {
            btnConfirmarAgendamento.classList.add("active");
            btnConfirmarAgendamento.disabled = false;
        } else {
            btnConfirmarAgendamento.classList.remove("active");
            btnConfirmarAgendamento.disabled = true;
        }
    }

    function confirmarAgendamento() {
        if (!barbeiroSelecionado || !dataSelecionada || !horarioSelecionado) return;

        const usuario = sessionStorage.getItem("usuarioLogado");

        const agendamento = {
            usuario,
            servico: servicoSelecionado,
            barbeiro: barbeiroSelecionado,
            data: dataSelecionada,
            horario: horarioSelecionado
        };

        fetch("http://localhost:3000/api/agendamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(agendamento)
        })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                alert("Agendamento realizado com sucesso!");
                modalAgendamento.style.display = "none";
            } else {
                alert("Erro ao realizar agendamento.");
            }
        })
        .catch(err => console.error("Erro ao enviar agendamento:", err));
    }
});

function isUserLoggedIn() {
    return sessionStorage.getItem("usuarioLogado") !== null;
}
