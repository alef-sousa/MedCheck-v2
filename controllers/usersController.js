import { supabase } from "../supabaseClient.js";

export async function getAllUsers(req, res) {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function createUser(req, res) {
  const { nome, endereco, dataNascimento, datanascimento, email, senha } = req.body;
  const dt = dataNascimento ?? datanascimento ?? null;
  if (!nome || !email || !senha || !dt)
    return res.status(400).json({ error: "Campos obrigatórios ausentes (nome, email, senha, dataNascimento)." });

  const insertObj = { nome, endereco: endereco ?? null, datanascimento: dt, email, senha };
  const { data, error } = await supabase.from("users").insert([insertObj]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

export async function loginUser(req, res) {
  const { email, senha } = req.body;
  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("senha", senha).single();
  if (error || !data) return res.status(401).json({ error: "Credenciais inválidas" });
  res.json(data);
}