// ------------------------------------------------------
// cadastro.js — versão revisada e melhorada
// ------------------------------------------------------

const API_BASE = (typeof API_BASE_GLOBAL !== "undefined")
    ? API_BASE_GLOBAL
    : "http://localhost:3030";

// Seleção do formulário
const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura dos campos
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validações básicas
    if (!nome || !endereco || !dataNascimento || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    // Dados do usuário
    const usuario = {
        nome,
        endereco,
        dataNascimento,
        email,
        senha
    };

    // --------------------------
    // TENTATIVA COM BACKEND
    // --------------------------
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
            console.warn("Erro do backend:", err);
            alert(err?.message || "Erro ao cadastrar no servidor. Salvando localmente.");
        }
    } catch (erro) {
        console.warn("Falha de comunicação com backend:", erro);
        alert("Não foi possível comunicar com o servidor. Salvando localmente.");
    }

    // --------------------------
    // FALLBACK LOCAL (LocalStorage)
    // --------------------------
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Evita duplicidade pelo email
    if (usuarios.some(u => u.email === email)) {
        alert("Este e-mail já está cadastrado localmente!");
        return;
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado localmente!");
    formCadastro.reset();
    window.location.href = "login.html";
});
