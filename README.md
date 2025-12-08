# 🏥 MedCheck — Sistema de Agendamento de Consultas

Aplicação completa com **backend Node.js + Supabase** e **frontend HTML/CSS/JS** para cadastro, login e gerenciamento de consultas médicas.

---

## 🚀 Funcionalidades

### 👤 Usuários

* Cadastro
* Login
* Sessão ativa no navegador
* Armazenamento no Supabase

### 📅 Consultas

* Agendar consultas
* Listar consultas do usuário
* Editar consulta
* Cancelar consulta
* Totalmente integrado ao Supabase

---

## 🛠 Tecnologias Utilizadas

### Backend

* Node.js
* Express
* CORS
* Supabase (PostgreSQL)
* dotenv
* nodemon

### Frontend

* HTML5
* CSS3
* JavaScript puro

---

## 📂 Estrutura do Projeto

```
MedCheck-v2/
│   server.js
│   package.json
│   supabaseClient.js
│   .env
│   index.html
│
├── controllers/
│     consultasController.js
│     usersController.js
│
├── routes/
│     consultas.js
│     users.js
│
├── html/
│     cadastro.html
│     login.html
│     consultas.html
│     confirmacao.html
│
├── js/
│     cadastro.js
│     login.js
│     consultas.js
│     confirmacao.js
│
└── css/
      *.css
```

---

## 🔧 Configuração do Backend

### 1️⃣ Instalar dependências

```
npm install
```

### 2️⃣ Criar arquivo `.env`

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=sua-chave-aqui
PORT=3030
```

### 3️⃣ Rodar servidor

```
npm run dev
```

O servidor inicia em:

```
http://localhost:3030
```

---

## 🗄 Estrutura do Banco (Supabase)

### Tabela `users`

| coluna         | tipo | obrigatória |
| -------------- | ---- | ----------- |
| id             | int8 | sim         |
| nome           | text | sim         |
| endereco       | text | sim         |
| datanascimento | date | sim         |
| email          | text | sim         |
| senha          | text | sim         |

⚠ **O nome da coluna deve ser exatamente:**
`datanascimento` (minúsculo, igual ao backend).

---

### Tabela `consultas`

| coluna     | tipo | obrigatória |
| ---------- | ---- | ----------- |
| id         | int8 | sim         |
| usuario_id | int8 | sim         |
| medico     | text | sim         |
| data       | date | sim         |
| hora       | text | sim         |
| local      | text | não         |

---

## 🔗 Endpoints da API

### Usuários

#### Criar usuário

```
POST /users
```

#### Login

```
POST /users/login
```

---

### Consultas

#### Criar consulta

```
POST /consultas
```

#### Listar por usuário

```
GET /consultas/usuario/:id
```

#### Editar

```
PUT /consultas/:id
```

#### Deletar

```
DELETE /consultas/:id
```

---

## 🌐 Deploy (Render)

* Subir backend no Render
* Criar variáveis no Render:

  * `SUPABASE_URL`
  * `SUPABASE_KEY`
* Configurar no frontend:

```html
<script>
    const API_BASE_GLOBAL = "https://seu-backend.onrender.com";
</script>
```

---

## 📌 Observações

* Login já funciona 100% com Supabase
* Cadastro depende da coluna `datanascimento` correta
* Consultas totalmente funcionais
* Projeto compatível com offline pelo fallback localStorage

---

Se quiser, posso gerar também a **versão PRO** do README com imagens, badges e GIFs.
