document.addEventListener("DOMContentLoaded", async function () {
    const tbodyProgramados = document.querySelector("#agenda-tbody-programados");
    const tbodyExcedidos = document.querySelector("#agenda-tbody-excedidos");

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
        if (status === "Cancelado pelo cliente") return "status-cancelado-cliente";
        return "status-agendado";
    }

    const agora = new Date();

    const programados = [];
    const excedidos = [];

    agendamentos.forEach(ag => {
        const dataAg = ag.data && ag.horario ? new Date(`${ag.data}T${ag.horario}`) : null;
        if (dataAg && dataAg >= agora) {
            programados.push({ ...ag, dataAg });
        } else if (dataAg) {
            excedidos.push({ ...ag, dataAg });
        }
    });

    // Ordene: programados (mais próximo primeiro), excedidos (mais recente primeiro)
    programados.sort((a, b) => a.dataAg - b.dataAg);
    excedidos.sort((a, b) => b.dataAg - a.dataAg);

    // Render programados
    programados.forEach(ag => {
        const tr = document.createElement("tr");
        tr.setAttribute('data-id', ag.idAgendamento);
        const canceladoPeloCliente = ag.estado === "Cancelado pelo cliente";
        tr.innerHTML = `
            <td>${ag.nomeCliente}</td>
            <td>
                <div>${ag.servico}</div>
                <div class="price">R$ ${ag.preco}</div>
                <div class="time">${tempoServico(ag.servico)}</div>
            </td>
            <td>${ag.barbeiro}</td>
            <td>${formatarDataHora(ag.data, ag.horario)}</td>
            <td>
                <div class="status-dropdown${canceladoPeloCliente ? ' disabled' : ''}">
                    <button class="status-btn ${statusClass(ag.estado)}" ${canceladoPeloCliente ? 'disabled' : ''}>${ag.estado}</button>
                    <div class="status-options">
                        <button class="option status-agendado" data-status="Agendado">Agendado</button>
                        <button class="option status-efetuado" data-status="Efetuado e Pago">Efetuado e Pago</button>
                        <button class="option status-cancelado" data-status="Cancelado">Cancelado</button>
                    </div>
                </div>
            </td>
        `;
        tbodyProgramados.appendChild(tr);
    });

    // Render excedidos
    excedidos.forEach(ag => {
        const tr = document.createElement("tr");
        tr.setAttribute('data-id', ag.idAgendamento);
        tr.classList.add("agendamento-vencido");
        tr.innerHTML = `
            <td>${ag.nomeCliente}</td>
            <td>
                <div>${ag.servico}</div>
                <div class="price">R$ ${ag.preco}</div>
                <div class="time">${tempoServico(ag.servico)}</div>
            </td>
            <td>${ag.barbeiro}</td>
            <td class="data-cell data-vencida">
                ${formatarDataHora(ag.data, ag.horario)}
                <span class="excedida">(data excedida)</span>
            </td>
            <td>
                <div class="status-dropdown${ag.estado === "Cancelado pelo cliente" ? ' disabled' : ''}">
                    <button class="status-btn ${statusClass(ag.estado)}" ${ag.estado === "Cancelado pelo cliente" ? 'disabled' : ''}>${ag.estado}</button>
                    <div class="status-options">
                        <button class="option status-agendado" data-status="Agendado">Agendado</button>
                        <button class="option status-efetuado" data-status="Efetuado e Pago">Efetuado e Pago</button>
                        <button class="option status-cancelado" data-status="Cancelado">Cancelado</button>
                    </div>
                </div>
            </td>
        `;
        tbodyExcedidos.appendChild(tr);
    });

    // Dropdown customizado
    document.querySelectorAll('.agenda-table').forEach(table => {
        table.addEventListener('click', async function (e) {
            const btn = e.target.closest('.status-btn');
            const option = e.target.closest('.option');
            const dropdown = e.target.closest('.status-dropdown');
            if (dropdown && dropdown.classList.contains('disabled')) return;
            if (btn && dropdown) {
                document.querySelectorAll('.status-dropdown').forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            } else if (option && dropdown) {
                const newStatus = option.getAttribute('data-status');
                const statusBtn = dropdown.querySelector('.status-btn');
                statusBtn.textContent = newStatus;
                statusBtn.className = `status-btn ${statusClass(newStatus)}`;
                dropdown.classList.remove('open');
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
                document.querySelectorAll('.status-dropdown').forEach(d => d.classList.remove('open'));
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.status-dropdown')) {
            document.querySelectorAll('.status-dropdown').forEach(d => d.classList.remove('open'));
        }
    });
});