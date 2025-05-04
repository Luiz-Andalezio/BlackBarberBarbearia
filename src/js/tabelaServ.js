//tabelaServ.js
const api = 'http://localhost:3000/api'; // ajuste conforme sua porta

const selData = document.getElementById('agendamento-data');
const selBarbeiro = document.getElementById('agendamento-barbeiro');
const selServico = document.getElementById('agendamento-servico');
const selHorario = document.getElementById('agendamento-horario');
const btnAgendar = document.getElementById('btnAgendar');
const mensagem = document.getElementById('agendamento-mensagem');

async function carregarBarbeiros() {
    const res = await fetch(`${api}/barbeiros`);
    const barbeiros = await res.json();
    selBarbeiro.innerHTML = barbeiros.map(b => 
        `<option value="${b.id}">${b.nome}</option>`
    ).join('');
}

async function carregarServicos() {
    const res = await fetch(`${api}/servicos`);
    const servicos = await res.json();
    selServico.innerHTML = servicos.map(s => 
        `<option value="${s.id}">${s.nome}</option>`
    ).join('');
}

function gerarHorarios() {
    const horarios = [];
    const inicio = 8 * 60; // 08:00 em minutos
    const fim = 18 * 60; // 18:00 em minutos

    for (let minutos = inicio; minutos < fim; minutos += 30) {
        const hora = Math.floor(minutos / 60);
        const min = minutos % 60;
        const formatado = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        horarios.push(formatado);
    }

    return horarios;
}

// Exemplo de uso:
const horariosDisponiveis = gerarHorarios();
console.log(horariosDisponiveis);

btnAgendar.addEventListener('click', async () => {
    const data = selData.value;
    const hora = selHorario.value;
    const servicoId = selServico.value;
    const barbeiroId = selBarbeiro.value;

    const res = await fetch(`${api}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, hora, servicoId, barbeiroId })
    });

    const msg = await res.text();
    mensagem.textContent = msg;
    if (res.ok) carregarHorarios();
});

selData.addEventListener('change', carregarHorarios);
selBarbeiro.addEventListener('change', carregarHorarios);

// Inicializar
carregarBarbeiros();
carregarServicos();
