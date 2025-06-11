document.addEventListener("DOMContentLoaded", function () {
    const infoText = document.getElementById("infoText");
    const mapContainer = document.getElementById("mapContainer");

    fetch("http://localhost:3000/api/info")
        .then(res => res.json())
        .then(info => {
            if (infoText) {
                infoText.innerHTML = `
          <p><strong class="freeman">Localização:</strong> <span class="tnr">${info.localizacao}</span></p>
          <p><strong class="freeman">Dias de Atendimento e Horário:</strong> <span class="tnr">${info.horario}</span></p>
          <p><strong class="freeman">Formas de Pagamento:</strong> <span class="tnr">${info.pagamento}</span></p>
          <p><strong class="freeman">Comodidades:</strong> <span class="tnr">${info.comodidades}</span></p>
          <p><strong class="freeman">Profissionais:</strong> <span class="tnr">${info.profissionais}</span></p>
          <p><strong class="freeman">Contatos:</strong> <span class="tnr">${info.contatos}</span></p>
        `;
            }

            if (mapContainer && info.mapa) {
                mapContainer.innerHTML = `
          <iframe 
            src="${info.mapa}"
            width="300" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        `;
            }
        })
        .catch(err => {
            console.error("Erro ao carregar informações:", err);
            if (infoText) {
                infoText.innerHTML = "<p class='erro'>Erro ao carregar informações da barbearia.</p>";
            }
        });
});
