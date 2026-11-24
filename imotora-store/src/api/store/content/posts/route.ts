import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../lib/community-db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const type = typeof req.query.type === "string" ? req.query.type : undefined
    const category = typeof req.query.category === "string" ? req.query.category : undefined
    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined

    const conditions: string[] = ["published = true"]
    const params: any[] = []

    if (type) {
      params.push(type)
      conditions.push(`type = $${params.length}`)
    }
    if (category && category !== "All") {
      params.push(category)
      conditions.push(`category = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      conditions.push(
        `(title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR content ILIKE $${params.length} OR tags ILIKE $${params.length})`
      )
    }

    const sql = `SELECT * FROM imotora_articles WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC, id ASC`
    const { rows } = await pool.query(sql, params)

    return res.status(200).json({ posts: rows })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to load articles" })
  }
}

