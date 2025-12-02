const API_BASE = (typeof API_BASE_GLOBAL !== "undefined") ? API_BASE_GLOBAL : "http://localhost:3030";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const infoUsuario = document.getElementById("infoUsuario");
const listaConsultasAgendadas = document.getElementById("listaConsultasAgendadas");
const formConsulta = document.getElementById("formConsulta");

if (!usuarioLogado) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
}

infoUsuario.innerHTML = `<p>Olá, <strong>${usuarioLogado.nome}</strong></p>`;

async function carregarConsultas() {
    listaConsultasAgendadas.innerHTML = "";

    try {
        const resp = await fetch(`${API_BASE}/consultas/${usuarioLogado.id}`);

        if (resp.ok) {
            const consultas = await resp.json();

            consultas.forEach(c => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${c.medico}</strong><br>
                    ${c.data} às ${c.hora}<br>
                    <button onclick="abrir(${c.id})">Abrir</button>
                `;
                listaConsultasAgendadas.appendChild(li);
            });

            return;
        }
    } catch (err) {
        console.warn("Backend offline, modo fallback");
    }

    // MODO OFFLINE
    const locais = JSON.parse(localStorage.getItem("consultas")) || [];
    const minhas = locais.filter(c => c.usuario_id === usuarioLogado.id);

    minhas.forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${c.medico}</strong><br>
            ${c.data} às ${c.hora}<br>
            <button onclick="abrir(${c.id})">Abrir</button>
        `;
        listaConsultasAgendadas.appendChild(li);
    });
}

carregarConsultas();

formConsulta.addEventListener("submit", async function (e) {
    e.preventDefault();

    const consulta = {
        usuario_id: usuarioLogado.id,  // CORRIGIDO
        medico: document.getElementById("medico").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        local: "Clínica"
    };

    try {
        const resp = await fetch(`${API_BASE}/consultas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(consulta)
        });

        if (resp.ok) {
            alert("Consulta agendada!");
            return carregarConsultas();
        }
    } catch (err) {
        console.warn("Erro no backend, salvando offline");
    }

    // MODO OFFLINE
    let locais = JSON.parse(localStorage.getItem("consultas")) || [];
    consulta.id = Date.now();
    locais.push(consulta);
    localStorage.setItem("consultas", JSON.stringify(locais));

    alert("Consulta salva offline.");
    carregarConsultas();
});

function abrir(id) {
    localStorage.setItem("consultaSelecionada", id);
    window.location.href = "confirmacao.html";
}

document.getElementById("botaoSair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});