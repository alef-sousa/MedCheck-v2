// cadastro.js
const API_BASE_GLOBAL = "https://medcheck-backend-dbbr.onrender.com";
const API_LOCAL = "http://localhost:3030";
const API_BASE = (location.hostname === "localhost") ? API_LOCAL : API_BASE_GLOBAL;

const formCadastro = document.getElementById("formCadastro");
formCadastro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const datanascimento = document.getElementById("datanascimento").value;
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const usuario = { nome, endereco, datanascimento, email, senha };

    try {
        const resp = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        if (resp.ok) {
            alert("Cadastro realizado com sucesso!");
            formCadastro.reset();
            window.location.href = "login.html";
            return;
        } else {
            const err = await resp.json().catch(() => null);
            console.warn("Erro (backend):", err);
            alert(err?.message || "Erro no cadastro (backend). Salvando localmente.");
        }
    } catch (err) {
        console.warn("Erro conectando ao backend:", err);
    }

    // Fallback local (compatibilidade)
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado (salvo localmente).");
    formCadastro.reset();
    window.location.href = "login.html";
});
