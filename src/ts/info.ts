const infoTs = {
  localizacao: "Uberaba.",
  horario: "Segunda a Sábado - 8h às 12h, 13h às 18h.",
  pagamento: "Pix, cartão de débito ou crédito.",
  comodidades: "Wifi, estacionamento, atende todas as idades.",
  profissionais: "Fulano e Fulaninho.",
  contatos: "+## (##) #####-####"
};

document.addEventListener("DOMContentLoaded", () => {
  const infoText = document.getElementById("infoText");

  if (infoText) {
    infoText.innerHTML = `
      <p><strong class="freeman">Localização:</strong> <span class="tnr">${infoTs.localizacao}</span></p>
      <p><strong class="freeman">Dias de Atendimento e Horário:</strong> <span class="tnr">${infoTs.horario}</span></p>
      <p><strong class="freeman">Formas de Pagamento:</strong> <span class="tnr">${infoTs.pagamento}</span></p>
      <p><strong class="freeman">Comodidades:</strong> <span class="tnr">${infoTs.comodidades}</span></p>
      <p><strong class="freeman">Profissionais:</strong> <span class="tnr">${infoTs.profissionais}</span></p>
      <p><strong class="freeman">Contatos:</strong> <span class="tnr">${infoTs.contatos}</span></p>
    `;
  }
});
