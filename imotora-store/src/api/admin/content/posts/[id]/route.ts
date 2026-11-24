import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../../lib/community-db"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid post ID" })
    }
    await pool.query(`DELETE FROM imotora_articles WHERE id = $1`, [id])
    return res.status(200).json({ deleted: true, id })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to delete post" })
  }
}

