import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../../lib/community-db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid thread ID" })
    }

    const { rows: threadRows } = await pool.query(
      `SELECT * FROM imotora_forum_threads WHERE id = $1 LIMIT 1`,
      [id]
    )
    if (!threadRows[0]) {
      return res.status(404).json({ message: "Thread not found" })
    }

    const { rows: replies } = await pool.query(
      `SELECT * FROM imotora_forum_replies WHERE thread_id = $1 ORDER BY created_at ASC`,
      [id]
    )

    return res.status(200).json({ thread: threadRows[0], replies })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to load thread" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid thread ID" })
    }

    const body = (req.body || {}) as {
      action?: "reply" | "upvote"
      author_name?: string
      body?: string
    }

    if (body.action === "upvote") {
      const { rows } = await pool.query(
        `UPDATE imotora_forum_threads SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *`,
        [id]
      )
      return res.status(200).json({ thread: rows[0] })
    }

    if (!body.body?.trim()) {
      return res.status(400).json({ message: "Reply message cannot be empty." })
    }

    const { rows } = await pool.query(
      `INSERT INTO imotora_forum_replies (thread_id, author_name, body, upvotes)
       VALUES ($1,$2,$3,0)
       RETURNING *`,
      [id, body.author_name?.trim() || "iMotora Collector", body.body.trim()]
    )

    return res.status(201).json({ reply: rows[0] })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to update thread" })
  }
}

