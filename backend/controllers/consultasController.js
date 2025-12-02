import { supabase } from "../supabaseClient.js";

// GET /consultas
export async function getAllConsultas(req, res) {
    const { data, error } = await supabase.from("consultas").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

// GET /consultas/usuario/:id
export async function getConsultasByUsuario(req, res) {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .eq("usuario_id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
}

// POST /consultas
export async function createConsulta(req, res) {
    const { usuario_id, medico, data, hora, local } = req.body;

    const { data: result, error } = await supabase
        .from("consultas")
        .insert([{ usuario_id, medico, data, hora, local }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(result);
}

// PUT /consultas/:id
export async function updateConsulta(req, res) {
    const { id } = req.params;
    const { medico, data, hora, local } = req.body;

    const { data: result, error } = await supabase
        .from("consultas")
        .update({ medico, data, hora, local })
        .eq("id", id)
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(result);
}

// DELETE /consultas/:id
export async function deleteConsulta(req, res) {
    const { id } = req.params;

    const { error } = await supabase
        .from("consultas")
        .delete()
        .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Consulta removida" });
}