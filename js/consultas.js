// consultas.js
const API_BASE = (typeof API_BASE_GLOBAL !== 'undefined') ? API_BASE_GLOBAL : "http://localhost:3030";

const formConsulta = document.getElementById("formConsulta");
const listaConsultasAgendadas = document.getElementById("listaConsultasAgendadas");
const infoUsuario = document.getElementById("infoUsuario");
const botaoSair = document.getElementById("botaoSair");

let usuarioAtual = JSON.parse(sessionStorage.getItem("usuarioAtual"));
let consultas = JSON.parse(localStorage.getItem("consultas")) || []; // fallback

if (!usuarioAtual) {
  alert("Você precisa estar logado!");
  window.location.href = "login.html";
} else {
  infoUsuario.innerHTML = `<p>Olá, ${usuarioAtual.nome}!</p>`;
  // tenta carregar do backend (se disponível)
  carregarConsultas();
}

async function carregarConsultas() {
  try {
    const resp = await fetch(`${API_BASE}/consultas/usuario/${usuarioAtual.id}`);
    if (resp.ok) {
      const data = await resp.json();
      consultas = data;
      renderizarConsultas();
      return;
    } else {
      console.warn("Erro ao buscar consultas no backend, status:", resp.status);
    }
  } catch (err) {
    console.warn("Não foi possível conectar ao backend para listar consultas:", err);
  }
  // fallback: renderizar local
  renderizarConsultas();
}

function renderizarConsultas() {
  listaConsultasAgendadas.innerHTML = "";

  const minhasConsultas = consultas.filter(c => {
    // quando vindo do backend, cada item tem usuario_id
    if (c.usuario_id !== undefined) return c.usuario_id === usuarioAtual.id;
    // fallback local (usa email)
    return c.email === usuarioAtual.email;
  });

  minhasConsultas.forEach((consulta, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${consulta.medico} - ${consulta.data} ${consulta.hora}
      <div>
        <button data-index="${index}" class="botao-editar">Editar</button>
        <button data-index="${index}" class="botao-excluir">Excluir</button>
      </div>
    `;
    listaConsultasAgendadas.appendChild(li);
  });

  document.querySelectorAll(".botao-editar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      window.editarConsulta(idx);
    });
  });
  document.querySelectorAll(".botao-excluir").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      window.excluirConsulta(idx);
    });
  });
}

formConsulta.addEventListener("submit", async function (e) {
  e.preventDefault();

  const medico = document.getElementById("medico").value.trim();
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  const novaConsulta = {
    usuario_id: usuarioAtual.id,
    medico,
    data,
    hora,
    local: null
  };

  // tenta criar no backend
  try {
    const resp = await fetch(`${API_BASE}/consultas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaConsulta)
    });
    if (resp.ok) {
      await carregarConsultas(); // atualiza da fonte
      formConsulta.reset();
      return;
    } else {
      const err = await resp.json().catch(()=>null);
      console.warn("Erro criando consulta (backend):", err);
    }
  } catch (err) {
    console.warn("Erro conectando ao backend para criar consulta:", err);
  }

  // fallback local
  consultas.push({ ...novaConsulta, email: usuarioAtual.email });
  localStorage.setItem("consultas", JSON.stringify(consultas));
  formConsulta.reset();
  renderizarConsultas();
});

// mantém funções globais para compatibilidade com HTML inline
window.editarConsulta = async function (index) {
  const consulta = consultas[index];
  if (!consulta) return;
  // usa id quando existir (backend)
  const id = consulta.id;
  const novoMedico = prompt("Novo médico:", consulta.medico);
  const novaData = prompt("Nova data:", consulta.data);
  const novaHora = prompt("Nova hora:", consulta.hora);

  const payload = {
    medico: novoMedico || consulta.medico,
    data: novaData || consulta.data,
    hora: novaHora || consulta.hora,
    local: consulta.local ?? null
  };

  if (id) {
    // update backend
    try {
      const resp = await fetch(`${API_BASE}/consultas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        await carregarConsultas();
        return;
      } else {
        console.warn("Erro atualizando consulta (backend)", resp.status);
      }
    } catch (err) {
      console.warn("Erro conectando ao backend para atualizar:", err);
    }
  }

  // fallback local
  consulta.medico = payload.medico;
  consulta.data = payload.data;
  consulta.hora = payload.hora;
  localStorage.setItem("consultas", JSON.stringify(consultas));
  renderizarConsultas();
};

window.excluirConsulta = async function (index) {
  const consulta = consultas[index];
  if (!consulta) return;
  const id = consulta.id;

  if (!confirm("Deseja realmente excluir esta consulta?")) return;

  if (id) {
    try {
      const resp = await fetch(`${API_BASE}/consultas/${id}`, { method: "DELETE" });
      if (resp.ok) {
        await carregarConsultas();
        return;
      } else {
        console.warn("Erro deletando consulta (backend)", resp.status);
      }
    } catch (err) {
      console.warn("Erro conectando ao backend para deletar:", err);
    }
  }

  // fallback local
  consultas.splice(index, 1);
  localStorage.setItem("consultas", JSON.stringify(consultas));
  renderizarConsultas();
};

botaoSair.addEventListener("click", function () {
  sessionStorage.removeItem("usuarioAtual");
  window.location.href = "login.html";
});