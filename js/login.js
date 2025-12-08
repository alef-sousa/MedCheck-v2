// login.js
const API_BASE = (typeof API_BASE_GLOBAL !== 'undefined') ? API_BASE_GLOBAL : "http://localhost:3030";
const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailLogin = document.getElementById("emailLogin").value.trim();
    const senhaLogin = document.getElementById("senhaLogin").value;

    // Tenta autenticar no backend (endpoint que retorna usuário)
    try {
        const resp = await fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailLogin, senha: senhaLogin })
        });

        if (resp.ok) {
            const user = await resp.json();
            // salva na session (permanece até fechar a aba)
            sessionStorage.setItem("usuarioAtual", JSON.stringify(user));
            alert("Login realizado com sucesso!");
            window.location.href = "consultas.html";
            return;
        } else {
            const err = await resp.json().catch(() => null);
            console.warn("Login falhou (backend):", err);
            alert(err?.error || err?.message || "E-mail ou senha incorretos!");
            return;
        }
    } catch (err) {
        console.warn("Erro conectando ao backend:", err);
    }

    // Fallback localStorage
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuariosLocal.find(u => u.email === emailLogin && u.senha === senhaLogin);
    if (usuarioEncontrado) {
        sessionStorage.setItem("usuarioAtual", JSON.stringify(usuarioEncontrado));
        alert("Login realizado com sucesso (local)!");
        window.location.href = "consultas.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
});
