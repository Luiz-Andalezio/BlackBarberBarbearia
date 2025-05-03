interface InfoData {
    localizacao: string;
    mapa: string;
    horario: string;
    pagamento: string;
    comodidades: string;
    profissionais: string;
    contatos: string;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("infoForm") as HTMLFormElement | null;
    const salvarBtn = document.getElementById("salvarBtn") as HTMLButtonElement | null;

    if (!form || !salvarBtn) return;

    const campos: (keyof InfoData)[] = [
        "localizacao",
        "mapa",
        "horario",
        "pagamento",
        "comodidades",
        "profissionais",
        "contatos",
    ];

    let originalData: InfoData;

    // Carregar dados do backend
    fetch("http://localhost:3000/api/info")
        .then((res) => res.json())
        .then((data: InfoData) => {
            originalData = data;
            campos.forEach((campo) => {
                const input = document.getElementById(campo) as HTMLInputElement | null;
                if (input && data[campo]) {
                    input.value = data[campo];
                }
            });
        })
        .catch((err) => {
            alert("Erro ao carregar informações: " + err.message);
        });

    // Detectar alterações
    form.addEventListener("input", () => {
        const houveMudanca = campos.some((campo) => {
            const input = document.getElementById(campo) as HTMLInputElement | null;
            return input && input.value !== originalData?.[campo];
        });
        salvarBtn.disabled = !houveMudanca;
    });

    // Submeter dados
    form.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const novoInfo: InfoData = {
            localizacao: "",
            mapa: "",
            horario: "",
            pagamento: "",
            comodidades: "",
            profissionais: "",
            contatos: "",
        };

        campos.forEach((campo) => {
            const input = document.getElementById(campo) as HTMLInputElement | null;
            novoInfo[campo] = input?.value ?? "";
        });

        fetch("http://localhost:3000/api/info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoInfo),
        })
            .then((res) => {
                if (res.ok) {
                    alert("Informações salvas com sucesso!");
                    salvarBtn.disabled = true;
                    originalData = { ...novoInfo };
                } else {
                    throw new Error("Falha ao salvar.");
                }
            })
            .catch((err) => {
                alert("Erro ao salvar informações: " + err.message);
            });
    });
});
