"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getGoogleAuthConfig, googleSignIn } from "@lib/data/customer"

export default function GoogleAuthButton({ label = "Continue with Google" }: { label?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [demoEmail, setDemoEmail] = useState("collector.demo@gmail.com")
  const [demoName, setDemoName] = useState("Aarav Mehta")
  const [error, setError] = useState<string | null>(null)

  // Handle Google OAuth redirect callback (#id_token=...) if real OAuth is configured
  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash
    if (hash && hash.includes("id_token=")) {
      const params = new URLSearchParams(hash.slice(1))
      const idToken = params.get("id_token")
      if (idToken) {
        setLoading(true)
        googleSignIn({ id_token: idToken }).then((res) => {
          setLoading(false)
          if (res.ok) {
            window.history.replaceState(null, "", window.location.pathname)
            router.refresh()
          } else {
            setError(res.error || "Google sign-in failed")
          }
        })
      }
    }
  }, [router])

  const handleClick = async () => {
    setError(null)
    setLoading(true)
    const cfg = await getGoogleAuthConfig()
    setLoading(false)

    if (cfg.configured && cfg.auth_url) {
      window.location.href = cfg.auth_url
      return
    }
    setShowDemoModal(true)
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const [first, ...rest] = demoName.trim().split(" ")
    const res = await googleSignIn({
      email: demoEmail.trim(),
      first_name: first || "Collector",
      last_name: rest.join(" ") || "Google",
    })
    setLoading(false)
    if (res.ok) {
      setShowDemoModal(false)
      router.refresh()
    } else {
      setError(res.error || "Sign-in failed")
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
          />
          <path
            fill="#34A853"
            d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
          />
        </svg>
        <span>{loading ? "Connecting to Google..." : label}</span>
      </button>

      {error && <p className="mt-2 text-xs text-rose-600 font-medium text-center">{error}</p>}

      {showDemoModal && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
                  <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                  <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <h3 className="text-base font-extrabold text-zinc-900">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Choose a Google account to continue to <strong>iMotora</strong>. (Add{" "}
              <code className="bg-zinc-100 px-1 rounded">GOOGLE_CLIENT_ID</code> in{" "}
              <code className="bg-zinc-100 px-1 rounded">.env</code> for live OAuth.)
            </p>
            <form onSubmit={handleDemoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-[var(--imotora-red)] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Google Email</label>
                <input
                  type="email"
                  required
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-[var(--imotora-red)] outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="imotora-btn-primary w-full py-2.5 text-sm"
              >
                {loading ? "Signing in..." : "Continue to iMotora →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

