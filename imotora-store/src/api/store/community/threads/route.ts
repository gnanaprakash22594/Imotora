import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../lib/community-db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const category = typeof req.query.category === "string" ? req.query.category : undefined
    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined

    const conditions: string[] = []
    const params: any[] = []

    if (category && category !== "All") {
      params.push(category)
      conditions.push(`t.category = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      conditions.push(
        `(t.title ILIKE $${params.length} OR t.body ILIKE $${params.length} OR t.tag ILIKE $${params.length})`
      )
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    const { rows } = await pool.query(
      `SELECT t.*, COUNT(r.id)::int AS reply_count
       FROM imotora_forum_threads t
       LEFT JOIN imotora_forum_replies r ON r.thread_id = t.id
       ${whereClause}
       GROUP BY t.id
       ORDER BY t.pinned DESC, t.created_at DESC`,
      params
    )

    return res.status(200).json({ threads: rows })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to load forum threads" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const body = (req.body || {}) as {
      category?: string
      title?: string
      body?: string
      author_name?: string
      tag?: string
    }

    if (!body.title?.trim() || !body.body?.trim()) {
      return res.status(400).json({ message: "Thread title and message are required." })
    }

    const { rows } = await pool.query(
      `INSERT INTO imotora_forum_threads (category, title, body, author_name, author_badge, tag, upvotes)
       VALUES ($1,$2,$3,$4,$5,$6,1)
       RETURNING *`,
      [
        body.category || "F1 Race Talk",
        body.title.trim(),
        body.body.trim(),
        body.author_name?.trim() || "iMotora Collector",
        "Community Member",
        body.tag?.trim() || "",
      ]
    )

    return res.status(201).json({ thread: { ...rows[0], reply_count: 0 } })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to create thread" })
  }
}

