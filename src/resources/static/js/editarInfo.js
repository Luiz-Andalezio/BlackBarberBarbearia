document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("infoForm");
    const salvarBtn = document.getElementById("salvarBtn");
    const campos = ["localizacao", "mapa", "horario", "pagamento", "comodidades", "profissionais", "contatos"];
    let originalData = {};

    // Carregar dados do backend
    fetch("http://localhost:3000/api/info")
        .then(res => res.json())
        .then(data => {
            originalData = data;
            campos.forEach(campo => {
                const input = document.getElementById(campo);
                if (input && data[campo]) input.value = data[campo];
            });
        })
        .catch(err => {
            alert("Erro ao carregar informações: " + err.message);
        });

    // Detectar alterações
    form.addEventListener("input", () => {
        const houveMudanca = campos.some(campo => {
            const input = document.getElementById(campo);
            return input.value !== originalData[campo];
        });
        salvarBtn.disabled = !houveMudanca;
    });

    // Submeter dados
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const novoInfo = {};
        campos.forEach(campo => {
            novoInfo[campo] = document.getElementById(campo).value;
        });

        fetch("http://localhost:3000/api/info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoInfo)
        })
            .then(res => {
                if (res.ok) {
                    alert("Informações salvas com sucesso!");
                    salvarBtn.disabled = true;
                    originalData = { ...novoInfo };
                } else {
                    throw new Error("Falha ao salvar.");
                }
            })
            .catch(err => {
                alert("Erro ao salvar informações: " + err.message);
            });
    });
});
