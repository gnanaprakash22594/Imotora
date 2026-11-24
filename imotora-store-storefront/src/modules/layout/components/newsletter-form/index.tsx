"use client"

import React, { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail("")
  }

  if (submitted) {
    return (
      <div className="mt-3 px-3.5 py-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
        ✓ Welcome to the iMotora Pit Crew! Check your inbox for collector drops.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex items-stretch max-w-xs">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 bg-zinc-100 border border-zinc-300 focus:border-[var(--imotora-red)] focus:bg-white rounded-l-md px-3 py-2 text-xs text-zinc-900 placeholder-zinc-500 outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe to newsletter"
        className="text-white px-3.5 rounded-r-md font-bold text-sm transition-colors flex items-center justify-center hover:opacity-90"
        style={{ backgroundColor: "var(--imotora-red)" }}
      >
        →
      </button>
    </form>
  )
}
