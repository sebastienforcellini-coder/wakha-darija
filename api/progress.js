import { db } from "./_db.js";

// GET  /api/progress?userId=...                       -> progression d'un profil
// POST /api/progress {userId, wordKey, status?}        -> enregistre/valide un mot
export default async function handler(req, res) {
  const sql = db();
  try {
    if (req.method === "GET") {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId requis." });
      }
      const rows = await sql`
        select word_key, status, updated_at
        from progress
        where user_id = ${userId}
      `;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { userId, wordKey, status } = req.body || {};
      if (!userId || !wordKey) {
        return res.status(400).json({ error: "userId et wordKey requis." });
      }
      const finalStatus = status || "known";

      const rows = await sql`
        insert into progress (user_id, word_key, status, updated_at)
        values (${userId}, ${wordKey}, ${finalStatus}, now())
        on conflict (user_id, word_key)
        do update set status = excluded.status, updated_at = now()
        returning word_key, status, updated_at
      `;
      return res.status(200).json(rows[0]);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non supportée." });
  } catch (err) {
    console.error("[/api/progress]", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
