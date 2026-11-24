"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { requestOtp, verifyOtpLogin } from "@lib/data/customer"

export default function OtpLogin() {
  const router = useRouter()
  const [step, setStep] = useState<"request" | "verify">("request")
  const [identifier, setIdentifier] = useState("")
  const [destination, setDestination] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setLoading(true)
    setError(null)
    const res = await requestOtp(identifier.trim())
    setLoading(false)

    if (!res.ok) {
      setError(res.error || "Could not send OTP")
      return
    }

    setDestination(res.destination || identifier.trim())
    setDevOtp(res.dev_otp || null)
    setStep("verify")
    setResendTimer(30)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().length < 6) {
      setError("Please enter the 6-digit OTP code.")
      return
    }
    setLoading(true)
    setError(null)
    const res = await verifyOtpLogin({ identifier: destination || identifier, code: code.trim() })
    setLoading(false)

    if (!res.ok) {
      setError(res.error || "Invalid OTP code")
      return
    }

    router.refresh()
  }

  return (
    <div className="w-full space-y-4">
      {step === "request" ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Mobile Number or Email Address
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+91 98765 43210 or collector@email.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[var(--imotora-red)] outline-none"
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              We&apos;ll send a 6-digit one-time passcode to sign you in instantly.
            </p>
          </div>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="imotora-btn-primary w-full py-2.5 text-sm"
          >
            {loading ? "Sending OTP..." : "Send 6-Digit OTP →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-700 flex items-center justify-between gap-2">
            <span>
              OTP sent to <strong className="text-zinc-950">{destination}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setStep("request")
                setCode("")
                setError(null)
              }}
              className="font-bold underline"
              style={{ color: "var(--imotora-red)" }}
            >
              Change
            </button>
          </div>

          {devOtp && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900 flex items-center justify-between">
              <span>
                Dev Mode OTP: <strong className="font-mono text-sm tracking-widest">{devOtp}</strong>
              </span>
              <button
                type="button"
                onClick={() => setCode(devOtp)}
                className="text-[11px] font-bold underline text-amber-800"
              >
                Auto-fill
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-center font-mono text-lg font-extrabold tracking-[0.4em] text-zinc-900 focus:border-[var(--imotora-red)] outline-none"
            />
          </div>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="imotora-btn-primary w-full py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>

          <div className="text-center text-xs text-zinc-500">
            {resendTimer > 0 ? (
              <span>Resend OTP in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="font-bold underline text-zinc-900 hover:text-[var(--imotora-red)]"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

