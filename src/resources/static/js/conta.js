document.addEventListener("DOMContentLoaded", () => {
    const tipo = sessionStorage.getItem("tipo");
    const userInfo = document.getElementById("userInfo");
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    if (usuarioLogado && userInfo) {
        userInfo.innerHTML = `
            <p><strong>Nome:</strong> ${usuarioLogado.nome}</p>
            <p><strong>Email:</strong> ${usuarioLogado.email}</p>
            <p><strong>Telefone:</strong> ${usuarioLogado.telefone || ""}</p>
            <p><strong>Tipo:</strong> ${usuarioLogado.tipo}</p>
        `;
    }

    // Modal helpers
    function openModal(id) { document.getElementById(id).style.display = "flex"; }
    function closeModal(id) { document.getElementById(id).style.display = "none"; }
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => closeModal(btn.parentElement.parentElement.id);
    });

    // Editar dados
    document.getElementById("btnEditarConta").onclick = () => {
        document.getElementById("editNome").value = usuarioLogado.nome;
        document.getElementById("editEmail").value = usuarioLogado.email;
        document.getElementById("editTelefone").value = usuarioLogado.telefone || "";
        document.getElementById("btnSalvarEdicao").disabled = true;
        openModal("modal-editar");
    };
    ["editNome", "editEmail", "editTelefone"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            const nome = document.getElementById("editNome").value.trim();
            const email = document.getElementById("editEmail").value.trim();
            const telefone = document.getElementById("editTelefone").value.trim();
            document.getElementById("btnSalvarEdicao").disabled =
                (nome === usuarioLogado.nome && email === usuarioLogado.email && telefone === (usuarioLogado.telefone || ""));
        });
    });
    document.getElementById("formEditarConta").onsubmit = async function (e) {
        e.preventDefault();
        const nome = document.getElementById("editNome").value.trim();
        const email = document.getElementById("editEmail").value.trim();
        const telefone = document.getElementById("editTelefone").value.trim();
        try {
            const res = await fetch(`/api/usuario/${usuarioLogado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, telefone })
            });
            const data = await res.json();
            if (data.sucesso) {
                usuarioLogado.nome = nome;
                usuarioLogado.email = email;
                usuarioLogado.telefone = telefone;
                sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
                userInfo.innerHTML = `
                    <p><strong>Nome:</strong> ${usuarioLogado.nome}</p>
                    <p><strong>Email:</strong> ${usuarioLogado.email}</p>
                    <p><strong>Telefone:</strong> ${usuarioLogado.telefone || ""}</p>
                    <p><strong>Tipo:</strong> ${usuarioLogado.tipo}</p>
                `;
                closeModal("modal-editar");
                alert("Dados atualizados com sucesso!");
            } else {
                alert(data.mensagem || "Erro ao atualizar dados.");
            }
        } catch (err) {
            alert("Erro ao atualizar dados.");
        }
    };

    // Alterar senha
    document.getElementById("btnAlterarSenha").onclick = () => {
        document.getElementById("senhaAtual").value = "";
        document.getElementById("novaSenha").value = "";
        document.getElementById("confirmaNovaSenha").value = "";
        document.getElementById("btnSalvarSenha").disabled = true;
        openModal("modal-senha");
    };
    ["senhaAtual", "novaSenha", "confirmaNovaSenha"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            const atual = document.getElementById("senhaAtual").value;
            const nova = document.getElementById("novaSenha").value;
            const conf = document.getElementById("confirmaNovaSenha").value;
            document.getElementById("btnSalvarSenha").disabled = !(atual && nova && conf && nova === conf);
        });
    });
    document.getElementById("formAlterarSenha").onsubmit = function (e) {
        e.preventDefault();
        openModal("modal-confirma-senha");
    };
    document.getElementById("btnConfirmaAlterarSenha").onclick = async function () {
        const senhaAtual = document.getElementById("senhaAtual").value;
        const novaSenha = document.getElementById("novaSenha").value;
        try {
            const res = await fetch(`/api/usuario/${usuarioLogado.id}/senha`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senhaAtual, novaSenha })
            });
            const data = await res.json();
            closeModal("modal-confirma-senha");
            closeModal("modal-senha");
            if (data.sucesso) {
                alert("Senha alterada com sucesso!");
            } else {
                alert(data.mensagem || "Erro ao alterar senha.");
            }
        } catch (err) {
            alert("Erro ao alterar senha.");
        }
    };
    document.getElementById("btnCancelaAlterarSenha").onclick = function () {
        closeModal("modal-confirma-senha");
    };

    // Excluir conta
    document.getElementById("btnExcluirConta").onclick = () => openModal("modal-excluir");
    document.getElementById("btnConfirmaExcluir").onclick = async function () {
        try {
            const res = await fetch(`/api/usuario/${usuarioLogado.id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            sessionStorage.clear();
            closeModal("modal-excluir");
            if (data.sucesso) {
                alert("Conta excluída com sucesso!");
                window.location.href = "/login.html";
            } else {
                alert(data.mensagem || "Erro ao excluir conta.");
            }
        } catch (err) {
            alert("Erro ao excluir conta.");
        }
    };
    document.getElementById("btnCancelaExcluir").onclick = function () {
        closeModal("modal-excluir");
    };

    // Deslogar
    document.getElementById("btnDeslogar").onclick = function (e) {
        e.preventDefault();
        openModal("modal-deslogar");
    };
    document.getElementById("btnConfirmaDeslogar").onclick = function () {
        sessionStorage.clear();
        closeModal("modal-deslogar");
        window.location.href = "/login.html";
    };
    document.getElementById("btnCancelaDeslogar").onclick = function () {
        closeModal("modal-deslogar");
    };
});