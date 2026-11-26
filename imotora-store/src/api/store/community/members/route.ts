import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ensureCommunityDb,
  getCommunityStatsFromDb,
} from "../../../../lib/community-db"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  try {
    const stats = await getCommunityStatsFromDb()
    return res.status(200).json({ stats })
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to load community stats" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pool = await ensureCommunityDb()
    const body = (req.body || {}) as {
      full_name?: string
      member_type?: string
      phone?: string
      email?: string
      city?: string
      state?: string
      interests?: string[]
    }

    const fullName = body.full_name?.trim() || ""
    const memberType = body.member_type?.trim() || ""
    const phone = body.phone?.trim() || ""
    const email = (body.email?.trim() || "").toLowerCase()
    const city = body.city?.trim() || ""
    const state = body.state?.trim() || ""
    const interests = Array.isArray(body.interests)
      ? body.interests.map((i) => String(i).trim()).filter(Boolean)
      : []

    if (!fullName || !memberType || !phone || !email || !city || !state) {
      return res.status(400).json({
        message:
          "Please fill in your name, category, phone number, email, city, and state.",
      })
    }

    if (!interests.length) {
      return res.status(400).json({
        message: "Please select at least one interest.",
      })
    }

    const { rows } = await pool.query(
      `INSERT INTO imotora_community_members (full_name, member_type, phone, email, city, state, interests)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (email) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         member_type = EXCLUDED.member_type,
         phone = EXCLUDED.phone,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         interests = EXCLUDED.interests
       RETURNING id, full_name, member_type, city, state, interests, created_at`,
      [fullName, memberType, phone, email, city, state, interests]
    )

    const stats = await getCommunityStatsFromDb()
    return res.status(201).json({ member: rows[0], stats })
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to save community profile" })
  }
}

