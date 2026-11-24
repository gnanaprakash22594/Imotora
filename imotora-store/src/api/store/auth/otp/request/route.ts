import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { generateOtpCode, normalizeIdentifier, otpStore } from "../../_helpers"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = (req.body || {}) as { identifier?: string }
    if (!body.identifier || !body.identifier.trim()) {
      return res.status(400).json({ message: "Please enter an email or mobile number." })
    }

    const { key, channel } = normalizeIdentifier(body.identifier)
    if (channel === "phone" && key.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." })
    }

    const code = generateOtpCode()
    otpStore.set(key, {
      code,
      channel,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    console.log(`[iMotora OTP] Sent ${code} to ${key} (${channel})`)

    return res.status(200).json({
      ok: true,
      channel,
      destination: key,
      expires_in: 300,
      ...(process.env.NODE_ENV !== "production" ? { dev_otp: code } : {}),
    })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to generate OTP" })
  }
}
