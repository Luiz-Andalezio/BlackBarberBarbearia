const servicesList = document.getElementById('services-list');

async function carregarServicos() {
    const res = await fetch("http://localhost:3000/api/servicos")

    const servicos = await res.json();

    servicos.forEach(servico => {
        adicionarServicoNaTela(servico.nome, servico.preco, servico.tempo);
    });
}

function adicionarServicoNaTela(nome, preco, tempo) {
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-edit';

    serviceDiv.innerHTML = `
        <form>
            <div class="form-group">
                <label>Nome do Serviço</label>
                <input type="text" value="${nome}" disabled>
            </div>
            <div class="form-group">
                <label>Preço (R$)</label>
                <input type="number" value="${preco}" disabled>
            </div>
            <div class="form-group">
                <label>Tempo (minutos)</label>
                <input type="number" value="${tempo}" disabled>
            </div>
            <div class="service-buttons">
                <button type="button" class="button edit-button" onclick="editService(this)">Editar</button>
                <button type="button" class="button delete-button" onclick="deleteService(this)">Excluir</button>
            </div>
        </form>
    `;
    servicesList.appendChild(serviceDiv);
}

function addService() {
    const nome = document.getElementById('new-service-name').value.trim();
    const preco = document.getElementById('new-service-price').value.trim();
    const tempo = document.getElementById('new-service-time').value.trim();

    if (!nome || !preco || !tempo) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    adicionarServicoNaTela(nome, preco, tempo);
    document.getElementById('new-service-form').reset();
    salvarServicosNoServidor();
}

function editService(button) {
    const form = button.closest('form');
    const inputs = form.querySelectorAll('input');

    if (button.textContent === 'Editar') {
        inputs.forEach(input => input.disabled = false);
        button.textContent = 'Salvar';
        button.classList.remove('edit-button');
        button.classList.add('save-button');
    } else {
        inputs.forEach(input => input.disabled = true);
        button.textContent = 'Editar';
        button.classList.remove('save-button');
        button.classList.add('edit-button');
        salvarServicosNoServidor();
    }
}

function deleteService(button) {
    const serviceDiv = button.closest('.service-edit');
    servicesList.removeChild(serviceDiv);
    salvarServicosNoServidor();
}

function coletarServicosDaTela() {
    const servicos = [];
    const serviceDivs = document.querySelectorAll('.service-edit');

    serviceDivs.forEach(div => {
        const inputs = div.querySelectorAll('input');
        servicos.push({
            nome: inputs[0].value,
            preco: inputs[1].value,
            tempo: inputs[2].value
        });
    });

    return servicos;
}

async function salvarServicosNoServidor() {
    const servicos = coletarServicosDaTela();

    await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicos)
    });
}

document.addEventListener('DOMContentLoaded', carregarServicos);
