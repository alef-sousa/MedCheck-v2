// routes/users.js
import { Router } from "express";
import { supabase } from "../supabaseClient.js";

export const router = Router();

// GET - listar todos os usuários
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST - criar novo usuário
router.post("/", async (req, res) => {
  const { nome, endereco, dataNascimento, email, senha } = req.body;

  if (!nome || !email || !senha || !dataNascimento) {
    return res.status(400).json({
      error: "Campos obrigatórios ausentes (nome, email, senha, dataNascimento).",
    });
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ nome, endereco, dataNascimento, email, senha }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// PUT - atualizar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  const { data, error } = await supabase
    .from("users")
    .update(campos)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// DELETE - remover usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Usuário removido" });
});