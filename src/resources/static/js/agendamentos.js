document.addEventListener("DOMContentLoaded", async function () {
    const tbody = document.getElementById("historico-tbody");

    // Pega usuário logado
    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado") || "{}");
    if (!usuario.id) {
        tbody.innerHTML = "<tr><td colspan='5'>Faça login para ver seus agendamentos.</td></tr>";
        return;
    }

    const agendamentos = await fetch("/api/agendamentos").then(r => r.json());

    const servicos = await fetch("/api/servicos").then(r => r.json());

    // Filtra só os do cliente e que não foram cancelados por ele
    const meusAgs = agendamentos
        .filter(ag => ag.idCliente === usuario.id && !ag.canceladoCliente)
        .sort((a, b) => {
            // Ordena do mais recente para o mais antigo, sempre por data/hora
            const dataA = new Date(a.data + "T" + a.horario);
            const dataB = new Date(b.data + "T" + b.horario);
            return dataB - dataA;
        });

    meusAgs.forEach(ag => {
        const tr = document.createElement("tr");
        let estado = ag.estado;
        if (estado === "Cancelado" && ag.canceladoCliente) {
            estado = "Cancelado pelo cliente";
        } else if (estado === "Cancelado") {
            estado = "Cancelado pelo barbeiro";
        }
        // Busca o tempo do serviço
        const servicoObj = servicos.find(s => s.nome === ag.servico);
        const tempo = servicoObj ? servicoObj.tempo : "";

        tr.innerHTML = `
        <td>
            <div>${ag.servico}</div>
            <div class="price">R$ ${ag.preco}</div>
            <div class="time">${tempo ? tempo + " minutos" : ""}</div>
        </td>
        <td>${ag.barbeiro}</td>
        <td>${ag.data.split("-").reverse().join("/")} ${ag.horario}</td>
        <td class="${statusClass(estado)}">${estado}</td>
        <td>
            ${estado === "Agendado" ? `<button class="cancelar-btn" data-id="${ag.idAgendamento}">Cancelar</button>` : ""}
        </td>
    `;
        tbody.appendChild(tr);
    });

    // Modal de confirmação de cancelamento
    let agendamentoParaCancelar = null;

    tbody.addEventListener("click", function (e) {
        const btn = e.target.closest(".cancelar-btn");
        if (!btn) return;
        agendamentoParaCancelar = btn;
        document.getElementById("modal-cancelar").style.display = "flex";
    });

    document.getElementById("btn-cancelar-sim").onclick = async function () {
        if (!agendamentoParaCancelar) return;
        const id = agendamentoParaCancelar.getAttribute("data-id");
        const res = await fetch(`/api/agendamentos/${id}/cancelar-cliente`, { method: "PUT" });
        const data = await res.json();
        alert(data.mensagem);
        if (data.sucesso) agendamentoParaCancelar.closest("tr").remove();
        document.getElementById("modal-cancelar").style.display = "none";
        agendamentoParaCancelar = null;
    };
    document.getElementById("btn-cancelar-nao").onclick = function () {
        document.getElementById("modal-cancelar").style.display = "none";
        agendamentoParaCancelar = null;
    };
    document.getElementById("close-cancelar-modal").onclick = function () {
        document.getElementById("modal-cancelar").style.display = "none";
        agendamentoParaCancelar = null;
    };
});

function statusClass(status) {
    if (status === "Agendado") return "status-agendado";
    if (status === "Efetuado e Pago") return "status-efetuado";
    if (status === "Cancelado" || status === "Cancelado pelo barbeiro") return "status-cancelado";
    if (status === "Cancelado pelo cliente") return "status-cancelado-cliente";
    return "status-agendado";
}