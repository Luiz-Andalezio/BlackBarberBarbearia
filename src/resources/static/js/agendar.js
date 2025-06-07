let barbeiroSelecionado = null;
let dataSelecionada = null;
let horarioSelecionado = null;
let servicoSelecionado = null;
let dataBase = new Date();
let agendamentosExistentes = [];

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

            document.querySelectorAll(".schedule-button").forEach(botao => {
                botao.addEventListener("click", async (e) => {
                    if (!isUserLoggedIn()) {
                        modalLogin.style.display = "flex";
                    } else {
                        servicoSelecionado = e.currentTarget.getAttribute("data-nome");
                        modalAgendamento.style.display = "flex";
                        resetarSelecoes();
                        await carregarAgendamentos();
                        await fetch("http://localhost:3000/api/barbeiros")
                            .then(res => res.json())
                            .then(barbeiros => {
                                window.listaBarbeiros = [...new Set(barbeiros.map(b => b.nome))];
                            });
                        gerarCalendario(dataBase);
                    }
                });
            });
        })
        .catch(err => {
            console.error("Erro ao carregar serviços:", err);
            servicesContainer.innerHTML = "<p>Erro ao carregar serviços.</p>";
        });

    if (btnLogin) btnLogin.addEventListener("click", () => window.location.href = "login.html");
    [btnCancelar, closeLoginModal].forEach(el => el?.addEventListener("click", () => modalLogin.style.display = "none"));
    if (closeAgendamentoModal) {
        closeAgendamentoModal.addEventListener("click", () => {
            modalAgendamento.style.display = "none";
            resetarSelecoes();
            limparModalAgendamento();
        });
    }

    btnConfirmarAgendamento.addEventListener("click", confirmarAgendamento);

    function resetarSelecoes() {
        barbeiroSelecionado = null;
        dataSelecionada = null;
        horarioSelecionado = null;
        btnConfirmarAgendamento.classList.remove("active");
    }

    function limparModalAgendamento() {
        document.getElementById("calendar-carousel").innerHTML = "";
        document.getElementById("barbeiros-container").innerHTML = "";
        document.getElementById("horarios-container").innerHTML = "";

        barbeiroSelecionado = null;
        dataSelecionada = null;
        horarioSelecionado = null;
        servicoSelecionado = null;

        document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));

        const btnConfirmar = document.getElementById("confirmar-agendamento");
        btnConfirmar.classList.remove("active");
        btnConfirmar.disabled = true;
    }

    async function carregarAgendamentos() {
        try {
            const res = await fetch("http://localhost:3000/api/agendamentos");
            agendamentosExistentes = await res.json();
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            agendamentosExistentes = [];
        }
    }

    function carregarBarbeiros() {
        fetch("http://localhost:3000/api/barbeiros")
            .then(res => res.json())
            .then(barbeiros => {
                window.listaBarbeiros = [...new Set(barbeiros.map(b => b.nome))];
                const container = document.getElementById("barbeiros-container");
                container.innerHTML = "";
                barbeiros.forEach(barbeiro => {
                    let indisponivel = false;
                    if (dataSelecionada) {
                        const horariosDoDia = gerarHorarios();
                        const ocupados = agendamentosExistentes.filter(
                            a => a.data === dataSelecionada && a.barbeiro === barbeiro.nome
                        );
                        indisponivel = ocupados.length >= horariosDoDia.length;
                    }
                    const btn = document.createElement("button");
                    btn.innerText = barbeiro.nome;
                    btn.disabled = indisponivel;
                    if (indisponivel) btn.style.opacity = "0.5";
                    btn.onclick = () => {
                        if (btn.disabled) return;
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

    function gerarCalendario(baseDate) {
        const container = document.getElementById("calendar-carousel");
        container.innerHTML = "";

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "10px";

        const mesAno = document.createElement("span");
        mesAno.innerText = baseDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        header.appendChild(mesAno);

        const botoes = document.createElement("div");

        const btnVoltar = document.createElement("button");
        btnVoltar.innerText = "<";
        btnVoltar.disabled = isHoje(baseDate);
        btnVoltar.onclick = () => {
            if (!isHoje(baseDate)) {
                dataBase.setDate(dataBase.getDate() - 7);
                gerarCalendario(dataBase);
            }
        };

        const btnAvancar = document.createElement("button");
        btnAvancar.innerText = ">";
        btnAvancar.onclick = () => {
            dataBase.setDate(dataBase.getDate() + 7);
            gerarCalendario(dataBase);
        };

        botoes.appendChild(btnVoltar);
        botoes.appendChild(btnAvancar);
        header.appendChild(botoes);
        container.appendChild(header);

        for (let i = 0; i < 7; i++) {
            const data = new Date(baseDate);
            data.setDate(baseDate.getDate() + i);
            const dataStr = data.toISOString().split('T')[0];

            let todosIndisponiveis = false;
            let barbeiros = window.listaBarbeiros || [];
            if (barbeiros.length > 0) {
                todosIndisponiveis = barbeiros.every(barbeiro => {
                    const horariosDoDia = gerarHorarios();
                    const ocupados = agendamentosExistentes.filter(
                        a => a.data === dataStr && a.barbeiro === barbeiro
                    );
                    return ocupados.length >= horariosDoDia.length;
                });
            }

            const botao = document.createElement("button");
            botao.innerText = `${data.getDate()}/${data.getMonth() + 1}`;
            botao.disabled = todosIndisponiveis;
            if (botao.disabled) botao.style.opacity = "0.5";
            botao.onclick = () => {
                if (botao.disabled) return;
                document.querySelectorAll("#calendar-carousel button").forEach(b => b.classList.remove("selected"));
                botao.classList.add("selected");
                dataSelecionada = dataStr;
                carregarBarbeiros();
                carregarHorarios();
                verificarHabilitarConfirmar();
            };
            container.appendChild(botao);
        }
    }

    function diaIndisponivel(dataStr) {
        const horariosDoDia = gerarHorarios();
        const ocupados = agendamentosExistentes.filter(a => a.data === dataStr);
        return ocupados.length >= horariosDoDia.length;
    }

    function carregarHorarios() {
        if (!barbeiroSelecionado || !dataSelecionada) return;

        const horariosContainer = document.getElementById("horarios-container");
        horariosContainer.innerHTML = "";

        const horarios = gerarHorarios();

        const ocupados = agendamentosExistentes
            .filter(a => a.data === dataSelecionada && a.barbeiro === barbeiroSelecionado)
            .map(a => a.horario);

        horarios.forEach(horario => {
            const btn = document.createElement("button");
            btn.innerText = horario;
            btn.disabled = ocupados.includes(horario);
            if (btn.disabled) btn.style.opacity = "0.5";

            btn.onclick = () => {
                if (btn.disabled) return;
                document.querySelectorAll("#horarios-container button").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                horarioSelecionado = horario;
                verificarHabilitarConfirmar();
            };

            horariosContainer.appendChild(btn);
        });
    }

    function gerarHorarios() {
        const horarios = [];
        for (let h = 8; h < 18; h++) {
            horarios.push(`${String(h).padStart(2, '0')}:00`);
            horarios.push(`${String(h).padStart(2, '0')}:30`);
        }
        horarios.push("18:00");
        return horarios;
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

function isHoje(date) {
    const hoje = new Date();
    return (
        date.getFullYear() === hoje.getFullYear() &&
        date.getMonth() === hoje.getMonth() &&
        date.getDate() === hoje.getDate()
    );
}

function isUserLoggedIn() {
    return sessionStorage.getItem("usuarioLogado") !== null;
}