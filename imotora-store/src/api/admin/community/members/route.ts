import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ensureCommunityDb } from "../../../../lib/community-db"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const { rows } = await pool.query(
      `SELECT id, full_name, member_type, phone, email, city, state, interests, created_at
       FROM imotora_community_members
       ORDER BY created_at DESC`
    )
    return res.status(200).json({ members: rows })
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to load community members" })
  }
}

