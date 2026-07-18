import { db } from "./_db.js";

// GET  /api/users            -> liste des profils
// POST /api/users {name, gender: "m"|"f"} -> crée un profil
export default async function handler(req, res) {
  const sql = db();
  try {
    if (req.method === "GET") {
      const rows = await sql`
        select id, name, gender, created_at
        from users
        order by created_at asc
      `;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { name, gender } = req.body || {};
      const cleanName = typeof name === "string" ? name.trim() : "";

      if (!cleanName) {
        return res.status(400).json({ error: "Le nom est requis." });
      }
      if (cleanName.length > 40) {
        return res.status(400).json({ error: "Nom trop long (40 caractères max)." });
      }
      if (gender !== "m" && gender !== "f") {
        return res.status(400).json({ error: "Genre invalide (m ou f)." });
      }

      const rows = await sql`
        insert into users (name, gender)
        values (${cleanName}, ${gender})
        returning id, name, gender, created_at
      `;
      return res.status(201).json(rows[0]);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non supportée." });
  } catch (err) {
    console.error("[/api/users]", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
