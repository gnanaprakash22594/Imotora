import { MedusaContainer } from "@medusajs/framework/types"
import { Modules, generateJwtToken } from "@medusajs/framework/utils"

type OtpRecord = {
  code: string
  expiresAt: number
  channel: "email" | "phone"
}

// Persist OTP store across hot reloads in dev
const globalAny = globalThis as any
if (!globalAny.__imotoraOtpStore) {
  globalAny.__imotoraOtpStore = new Map<string, OtpRecord>()
}
export const otpStore: Map<string, OtpRecord> = globalAny.__imotoraOtpStore

export function normalizeIdentifier(raw: string): {
  key: string
  channel: "email" | "phone"
  email: string
  phone?: string
} {
  const trimmed = raw.trim()
  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase()
    return { key: email, channel: "email", email }
  }
  const digits = trimmed.replace(/\D/g, "")
  const normalizedPhone = digits.startsWith("91") && digits.length === 12
    ? `+${digits}`
    : digits.length === 10
    ? `+91${digits}`
    : `+${digits}`
  return {
    key: normalizedPhone,
    channel: "phone",
    email: `${digits}@phone.imotora.in`,
    phone: normalizedPhone,
  }
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function findOrCreateCustomerAndIssueToken(
  container: MedusaContainer,
  input: {
    email: string
    phone?: string
    first_name?: string
    last_name?: string
    provider: "otp" | "google"
  }
) {
  const customerModule = container.resolve(Modules.CUSTOMER)
  const email = input.email.toLowerCase().trim()

  const existing = await customerModule.listCustomers({ email })
  let customer = existing?.[0]

  if (!customer) {
    customer = await customerModule.createCustomers({
      email,
      first_name: input.first_name || (input.provider === "google" ? "Google" : "iMotora"),
      last_name: input.last_name || "Collector",
      phone: input.phone || undefined,
      has_account: true,
      metadata: {
        auth_provider: input.provider,
      },
    })
  }

  const jwtSecret = process.env.JWT_SECRET || "supersecret"
  const token = generateJwtToken(
    {
      actor_id: customer.id,
      actor_type: "customer",
      auth_identity_id: `auth_${input.provider}_${customer.id}`,
      app_metadata: {
        customer_id: customer.id,
      },
    },
    {
      secret: jwtSecret,
      expiresIn: "7d",
    }
  )

  return { token, customer }
}
