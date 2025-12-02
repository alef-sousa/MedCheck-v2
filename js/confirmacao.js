// confirmacao.js
const API_BASE = (typeof API_BASE_GLOBAL !== 'undefined') ? API_BASE_GLOBAL : "http://localhost:3030";
const consultaAtual = JSON.parse(sessionStorage.getItem("consultaAtual"));

const confMedico = document.getElementById("confMedico");
const confData = document.getElementById("confData");
const confHora = document.getElementById("confHora");
const confLocal = document.getElementById("confLocal");

const botaoReagendar = document.getElementById("botaoReagendar");
const botaoCancelar = document.getElementById("botaoCancelar");
const areaReagendar = document.getElementById("areaReagendar");
const novaData = document.getElementById("novaData");
const novaHora = document.getElementById("novaHora");
const salvarReagendamento = document.getElementById("salvarReagendamento");

if (!consultaAtual) {
    alert("Nenhuma consulta selecionada!");
    window.location.href = "consultas.html";
} else {
    confMedico.textContent = consultaAtual.medico;
    confData.textContent = consultaAtual.data;
    confHora.textContent = consultaAtual.hora;
    confLocal.textContent = consultaAtual.local || "Não definido";
}

botaoReagendar.addEventListener("click", function () {
    areaReagendar.style.display = "block";
});

salvarReagendamento.addEventListener("click", async function () {
    const novaD = novaData.value || consultaAtual.data;
    const novaH = novaHora.value || consultaAtual.hora;

    if (consultaAtual.id) {
        try {
            const resp = await fetch(`${API_BASE}/consultas/${consultaAtual.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: novaD, hora: novaH, local: consultaAtual.local || null })
            });
            if (resp.ok) {
                alert("Consulta atualizada com sucesso!");
                window.location.href = "consultas.html";
                return;
            } else {
                console.warn("Erro backend ao atualizar consulta", resp.status);
            }
        } catch (err) {
            console.warn("Erro conectando ao backend:", err);
        }
    }

    // fallback local
    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    const index = consultas.findIndex(c =>
        c.email === consultaAtual.email &&
        c.medico === consultaAtual.medico &&
        c.data === consultaAtual.data &&
        c.hora === consultaAtual.hora
    );

    if (index !== -1) {
        consultas[index].data = novaD;
        consultas[index].hora = novaH;
        localStorage.setItem("consultas", JSON.stringify(consultas));
        alert("Consulta atualizada com sucesso!");
        window.location.href = "consultas.html";
    } else {
        alert("Não foi possível encontrar a consulta para atualizar.");
    }
});

botaoCancelar.addEventListener("click", async function () {
    if (!confirm("Deseja realmente cancelar esta consulta?")) return;

    if (consultaAtual.id) {
        try {
            const resp = await fetch(`${API_BASE}/consultas/${consultaAtual.id}`, { method: "DELETE" });
            if (resp.ok) {
                alert("Consulta cancelada!");
                window.location.href = "consultas.html";
                return;
            } else {
                console.warn("Erro backend ao deletar consulta", resp.status);
            }
        } catch (err) {
            console.warn("Erro conectando ao backend:", err);
        }
    }

    // fallback local
    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    consultas = consultas.filter(c => !(c.email === consultaAtual.email && c.medico === consultaAtual.medico && c.data === consultaAtual.data && c.hora === consultaAtual.hora));
    localStorage.setItem("consultas", JSON.stringify(consultas));
    alert("Consulta cancelada!");
    window.location.href = "consultas.html";
});