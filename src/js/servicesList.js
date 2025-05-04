
const servicesList = document.getElementById('services-list');

function addService() {
    const name = document.getElementById('new-service-name').value;
    const price = document.getElementById('new-service-price').value;
    const time = document.getElementById('new-service-time').value;

    if (!name || !price || !time) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-edit';

    serviceDiv.innerHTML = `
        <form>
            <div class="form-group">
                <label>Nome do Serviço</label>
                <input type="text" value="${name}" disabled>
            </div>
            <div class="form-group">
                <label>Preço (R$)</label>
                <input type="number" value="${price}" disabled>
            </div>
            <div class="form-group">
                <label>Tempo (minutos)</label>
                <input type="number" value="${time}" disabled>
            </div>
            <button type="button" class="button edit-button" onclick="editService(this)">Editar</button>
            <button type="button" class="button delete-button" onclick="deleteService(this)">Excluir</button>
        </form>
    `;

    servicesList.appendChild(serviceDiv);

    document.getElementById('new-service-form').reset();
}

function editService(button) {
    const form = button.parentElement;
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
    }
}

function deleteService(button) {
    const serviceDiv = button.parentElement.parentElement;
    servicesList.removeChild(serviceDiv);
}