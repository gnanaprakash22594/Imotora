import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../lib/community-db"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const { rows } = await pool.query(
      `SELECT * FROM imotora_articles ORDER BY created_at DESC, id DESC`
    )
    return res.status(200).json({ posts: rows })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to fetch posts" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const body = (req.body || {}) as {
      title?: string
      type?: "blog" | "encyclopedia"
      category?: string
      excerpt?: string
      content?: string
      cover_image?: string
      author?: string
      read_time?: string
      tags?: string
      specs_json?: Record<string, string>
    }

    if (!body.title?.trim() || !body.content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." })
    }

    const baseSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    const { rows } = await pool.query(
      `INSERT INTO imotora_articles (slug, type, category, title, excerpt, content, cover_image, author, read_time, specs_json, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)
       RETURNING *`,
      [
        slug,
        body.type === "encyclopedia" ? "encyclopedia" : "blog",
        body.category || (body.type === "encyclopedia" ? "F1 Encyclopedia" : "F1 News"),
        body.title.trim(),
        body.excerpt?.trim() || body.content.trim().slice(0, 150) + "...",
        body.content.trim(),
        body.cover_image || "/images/col-motorsport.jpg",
        body.author || "iMotora Editorial",
        body.read_time || (body.type === "encyclopedia" ? "Reference" : "4 min read"),
        JSON.stringify(body.specs_json || {}),
        body.tags || "F1,Diecast",
      ]
    )

    return res.status(201).json({ post: rows[0] })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to publish post" })
  }
}

