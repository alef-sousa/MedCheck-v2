const API_BASE = (typeof API_BASE_GLOBAL !== "undefined") ? API_BASE_GLOBAL : "http://localhost:3030";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value;

    const credenciais = { email, senha };

    try {
        const resp = await fetch(`${API_BASE}/users/login`, { // corrigido
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credenciais)
        });

        if (resp.ok) {
            const data = await resp.json();
            alert("Login efetuado com sucesso!");

            localStorage.setItem("usuarioLogado", JSON.stringify(data));
            window.location.href = "consultas.html";
            return;
        }
    } catch (err) {
        console.warn("Backend indisponível:", err);
    }

    alert("Erro no login");
});