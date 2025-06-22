document.addEventListener("DOMContentLoaded", async function () {
    const tbody = document.querySelector("#agenda-tbody");

    // Carrega os agendamentos
    const agendamentos = await fetch("/api/agendamentos").then(r => r.json());
    // Carrega os serviços (para tempo/preço)
    const servicos = await fetch("/api/servicos").then(r => r.json());

    function formatarDataHora(data, hora) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano} ${hora}`;
    }
    function tempoServico(nome) {
        const s = servicos.find(s => s.nome === nome);
        return s ? `${s.tempo} minutos` : "";
    }
    function statusClass(status) {
        if (status === "Agendado") return "status-agendado";
        if (status === "Efetuado e Pago") return "status-efetuado";
        if (status === "Cancelado") return "status-cancelado";
        return "status-agendado";
    }

    agendamentos.forEach(ag => {
        const tr = document.createElement("tr");
        tr.setAttribute('data-id', ag.id);
        tr.innerHTML = `
        <td>${ag.cliente}</td>
        <td>
            <div>${ag.servico}</div>
            <div class="price">R$ ${ag.preco}</div>
            <div class="time">${tempoServico(ag.servico)}</div>
        </td>
        <td>${ag.barbeiro}</td>
        <td>${formatarDataHora(ag.data, ag.horario)}</td>
        <td>
            <div class="status-dropdown">
                <button class="status-btn ${statusClass(ag.estado)}">${ag.estado}</button>
                <div class="status-options">
                    <button class="option status-agendado" data-status="Agendado">Agendado</button>
                    <button class="option status-efetuado" data-status="Efetuado e Pago">Efetuado e Pago</button>
                    <button class="option status-cancelado" data-status="Cancelado">Cancelado</button>
                </div>
            </div>
        </td>
    `;
        tbody.appendChild(tr);
    });

    // Dropdown customizado
    tbody.addEventListener('click', async function (e) {
        const btn = e.target.closest('.status-btn');
        const option = e.target.closest('.option');
        const dropdown = e.target.closest('.status-dropdown');
        if (btn && dropdown) {
            // Toggle dropdown
            document.querySelectorAll('.status-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        } else if (option && dropdown) {
            // Seleciona opção
            const newStatus = option.getAttribute('data-status');
            const statusBtn = dropdown.querySelector('.status-btn');
            statusBtn.textContent = newStatus;
            statusBtn.className = `status-btn ${statusClass(newStatus)}`;
            dropdown.classList.remove('open');
            // Atualiza backend
            const tr = dropdown.closest('tr');
            const agendamentoId = tr.getAttribute('data-id');
            if (agendamentoId) {
                await fetch(`/api/agendamentos/${agendamentoId}/estado`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ estado: newStatus })
                });
            }
        } else {
            // Fecha dropdown se clicar fora
            document.querySelectorAll('.status-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.status-dropdown')) {
            document.querySelectorAll('.status-dropdown').forEach(d => d.classList.remove('open'));
        }
    });
});