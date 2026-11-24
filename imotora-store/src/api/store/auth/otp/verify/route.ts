import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  findOrCreateCustomerAndIssueToken,
  normalizeIdentifier,
  otpStore,
} from "../../_helpers"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = (req.body || {}) as {
      identifier?: string
      code?: string
      first_name?: string
      last_name?: string
    }

    if (!body.identifier || !body.code) {
      return res.status(400).json({ message: "Identifier and 6-digit OTP code are required." })
    }

    const { key, email, phone } = normalizeIdentifier(body.identifier)
    const record = otpStore.get(key)

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not requested. Please request a new code." })
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key)
      return res.status(400).json({ message: "OTP has expired. Please request a new code." })
    }

    if (record.code !== body.code.trim()) {
      return res.status(401).json({ message: "Invalid OTP code. Please check and try again." })
    }

    otpStore.delete(key)

    const { token, customer } = await findOrCreateCustomerAndIssueToken(req.scope, {
      email,
      phone,
      first_name: body.first_name,
      last_name: body.last_name,
      provider: "otp",
    })

    return res.status(200).json({ token, customer })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "OTP verification failed" })
  }
}
