const API_BASE = (typeof API_BASE_GLOBAL !== "undefined") ? API_BASE_GLOBAL : "https://medcheck-backend-dbbr.onrender.com/";

const idConsulta = localStorage.getItem("consultaSelecionada");
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuario || !idConsulta) {
    alert("Nenhuma consulta selecionada.");
    window.location.href = "consultas.html";
}

const confMedico = document.getElementById("confMedico");
const confData = document.getElementById("confData");
const confHora = document.getElementById("confHora");
const confLocal = document.getElementById("confLocal");

let consultaAtual = null;

async function carregarConsulta() {
    try {
        const resp = await fetch(`${API_BASE}/consultas/detalhe/${idConsulta}`);
        if (resp.ok) consultaAtual = await resp.json();
    } catch (err) {
        console.warn("Backend indisponível");
    }

    if (!consultaAtual) {
        const locais = JSON.parse(localStorage.getItem("consultas")) || [];
        consultaAtual = locais.find(c => Number(c.id) === Number(idConsulta));
    }

    if (!consultaAtual) {
        alert("Erro ao carregar consulta.");
        window.location.href = "consultas.html";
        return;
    }

    confMedico.textContent = consultaAtual.medico;
    confData.textContent = consultaAtual.data;
    confHora.textContent = consultaAtual.hora;
    confLocal.textContent = consultaAtual.local || "Clínica Central";
}

carregarConsulta();

// REAGENDAR
document.getElementById("botaoReagendar").addEventListener("click", () => {
    document.getElementById("areaReagendar").style.display = "block";
});

document.getElementById("salvarReagendamento").addEventListener("click", async () => {
    const novaData = document.getElementById("novaData").value;
    const novaHora = document.getElementById("novaHora").value;

    const atualizada = {
        ...consultaAtual,
        data: novaData,
        hora: novaHora,
        usuario_id: usuario.id
    };

    try {
        const resp = await fetch(`${API_BASE}/consultas/${consultaAtual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizada)
        });

        if (resp.ok) {
            alert("Consulta reagendada!");
            return window.location.reload();
        }
    } catch (err) {
        console.warn("Backend indisponível, salvando offline");
    }

    let locais = JSON.parse(localStorage.getItem("consultas")) || [];
    const idx = locais.findIndex(c => Number(c.id) === Number(consultaAtual.id));
    if (idx !== -1) locais[idx] = atualizada;

    localStorage.setItem("consultas", JSON.stringify(locais));

    alert("Consulta reagendada offline.");
    window.location.reload();
});

// CANCELAR
document.getElementById("botaoCancelar").addEventListener("click", async () => {
    if (!confirm("Deseja cancelar?")) return;

    try {
        const resp = await fetch(`${API_BASE}/consultas/${consultaAtual.id}`, {
            method: "DELETE"
        });

        if (resp.ok) {
            alert("Consulta cancelada!");
            return window.location.href = "consultas.html";
        }
    } catch (err) {
        console.warn("Backend indisponível, apagando local");
    }

    let locais = JSON.parse(localStorage.getItem("consultas")) || [];
    locais = locais.filter(c => Number(c.id) !== Number(consultaAtual.id));
    localStorage.setItem("consultas", JSON.stringify(locais));

    alert("Consulta cancelada offline.");
    window.location.href = "consultas.html";
});