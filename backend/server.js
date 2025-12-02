// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as usersRouter } from "./routes/users.js";
import { router as consultasRouter } from "./routes/consultas.js";

dotenv.config();

const app = express();

// Permitir requisições da web (Render + front)
app.use(cors({
  origin: "*", // você pode restringir depois
}));

app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor ONLINE! 🚀");
});

// Rotas da API
app.use("/users", usersRouter);
app.use("/consultas", consultasRouter);

// Porta do Render OU local
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
