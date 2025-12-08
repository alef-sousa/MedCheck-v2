import { supabase } from "../supabaseClient.js";

// GET /users
export async function getAllUsers(req, res) {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

// POST /users – cadastro
export async function createUser(req, res) {
    const { nome, endereco, dataNascimento, email, senha } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ nome, endereco, dataNascimento, email, senha }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
}

// POST /users/login
export async function loginUser(req, res) {
    const { email, senha } = req.body;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("senha", senha)
        .single();

    if (error || !data)
        return res.status(401).json({ error: "Credenciais inválidas" });

    res.json(data);
}