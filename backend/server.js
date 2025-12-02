// backend/server.js
import express from "express";
import cors from "cors";
import { router as usersRouter } from "./routes/users.js";
import { router as consultasRouter } from "./routes/consultas.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rota teste
app.get("/", (req, res) => {
  res.send("Servidor ONLINE!");
});

// rotas
app.use("/users", usersRouter);
app.use("/consultas", consultasRouter);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
