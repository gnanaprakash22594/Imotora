"use client"

import React, { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-[#0B0B0E] text-white py-12 min-h-[70vh]">
      <div className="content-container max-w-4xl">
        <div className="mb-8">
          <h1 className="font-racing text-3xl sm:text-4xl font-extrabold">
            Contact <span className="text-[#E11D2E]">iMotora</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Questions about a limited edition drop, bulk collector orders, or shipping? Reach out to
            our pit crew.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-[#141418] border border-white/10 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E11D2E]">
                Collector Support
              </h3>
              <p className="text-sm text-zinc-200 mt-1">support@imotora.in</p>
              <p className="text-xs text-zinc-400">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E11D2E]">
                Collector Vault &amp; Dispatch
              </h3>
              <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                Plot 42, Motorsport Industrial Park, Andheri East, Mumbai, Maharashtra 400069
              </p>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#141418] border border-white/10 rounded-2xl p-6">
            {submitted ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-lg font-bold text-emerald-400">✓ Message Received!</p>
                <p className="text-sm text-zinc-300">
                  Our collector support team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    className="w-full bg-[#1C1C24] border border-white/10 focus:border-[#E11D2E] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="collector@email.com"
                    className="w-full bg-[#1C1C24] border border-white/10 focus:border-[#E11D2E] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the model or order you need help with..."
                    className="w-full bg-[#1C1C24] border border-white/10 focus:border-[#E11D2E] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <button type="submit" className="imotora-btn-primary px-6 py-2.5 text-sm">
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

