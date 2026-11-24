import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { findOrCreateCustomerAndIssueToken } from "../_helpers"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/in/account?google_callback=1"

  if (clientId) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: "id_token",
      scope: "openid email profile",
      nonce: Math.random().toString(36).slice(2),
    })
    return res.status(200).json({
      configured: true,
      auth_url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    })
  }

  return res.status(200).json({
    configured: false,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = (req.body || {}) as {
      id_token?: string
      email?: string
      first_name?: string
      last_name?: string
    }

    let email = body.email
    let firstName = body.first_name
    let lastName = body.last_name

    // If a real Google ID Token is supplied, verify it with Google
    if (body.id_token) {
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.id_token)}`
      )
      if (!verifyRes.ok) {
        return res.status(401).json({ message: "Invalid Google ID token." })
      }
      const profile = (await verifyRes.json()) as {
        email?: string
        given_name?: string
        family_name?: string
      }
      email = profile.email
      firstName = profile.given_name || firstName
      lastName = profile.family_name || lastName
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "A valid Google email address is required." })
    }

    const { token, customer } = await findOrCreateCustomerAndIssueToken(req.scope, {
      email,
      first_name: firstName || email.split("@")[0],
      last_name: lastName || "Collector",
      provider: "google",
    })

    return res.status(200).json({ token, customer })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Google sign-in failed" })
  }
}
