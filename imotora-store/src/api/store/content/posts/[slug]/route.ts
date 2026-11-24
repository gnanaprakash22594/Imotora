import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../../lib/community-db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const slug = req.params.slug
    const { rows } = await pool.query(
      `SELECT * FROM imotora_articles WHERE slug = $1 AND published = true LIMIT 1`,
      [slug]
    )
    if (!rows[0]) {
      return res.status(404).json({ message: "Article not found" })
    }
    return res.status(200).json({ post: rows[0] })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to load article" })
  }
}

