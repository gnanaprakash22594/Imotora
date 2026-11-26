"use client"

import React, { useState } from "react"
import { CommunityStats, registerCommunityMember } from "@lib/data/community"

export const MEMBER_CATEGORIES = [
  "Hobbyist",
  "Collector",
  "Wholesaler",
  "Retailer",
  "Track Builder",
  "Reseller / Trader",
]

export const INTEREST_OPTIONS = [
  "1:64 Die-Cast",
  "1:43 F1 & Motorsport",
  "1:18 Scale Models",
  "Racing Tracks",
  "LED Displays & Dioramas",
  "Vintage & Classics",
  "Bulk / Wholesale",
]

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other / International",
]

export default function CommunityProfileForm({
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
  onRegistered,
}: {
  defaultName?: string
  defaultEmail?: string
  defaultPhone?: string
  onRegistered?: (stats: CommunityStats | undefined, fullName: string) => void
}) {
  const [memberName, setMemberName] = useState(defaultName)
  const [memberType, setMemberType] = useState("Hobbyist")
  const [memberPhone, setMemberPhone] = useState(defaultPhone)
  const [memberEmail, setMemberEmail] = useState(defaultEmail)
  const [memberCity, setMemberCity] = useState("")
  const [memberState, setMemberState] = useState("Maharashtra")
  const [memberInterests, setMemberInterests] = useState<string[]>([
    "1:64 Die-Cast",
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const toggleInterest = (interest: string) => {
    setMemberInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!memberInterests.length) {
      setError("Please select at least one interest.")
      return
    }

    setSubmitting(true)
    const res = await registerCommunityMember({
      full_name: memberName.trim(),
      member_type: memberType,
      phone: memberPhone.trim(),
      email: memberEmail.trim(),
      city: memberCity.trim(),
      state: memberState,
      interests: memberInterests,
    })
    setSubmitting(false)

    if (!res.ok) {
      setError(res.error || "Could not save your profile. Please try again.")
      return
    }

    setSuccess(
      `Welcome ${memberName.trim()}! You're registered as a ${memberType} from ${memberCity.trim()}, ${memberState}.`
    )
    onRegistered?.(res.stats, memberName.trim())
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 flex items-center justify-between gap-3">
          <span>✓ {success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs sm:text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Member Category Selector */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-2">
            I am a... *
          </label>
          <div className="flex flex-wrap gap-2">
            {MEMBER_CATEGORIES.map((cat) => {
              const active = memberType === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMemberType(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                    active
                      ? "text-white border-transparent shadow-sm"
                      : "bg-zinc-50 text-zinc-800 border-zinc-300 hover:border-[#0D0D10]"
                  }`}
                  style={
                    active
                      ? { backgroundColor: "var(--imotora-red)" }
                      : undefined
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Name, Phone, Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Full Name / Business Name *
            </label>
            <input
              type="text"
              required
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Aarav Kapoor"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={memberPhone}
              onChange={(e) => setMemberPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={memberCity}
              onChange={(e) => setMemberCity(e.target.value)}
              placeholder="e.g. Mumbai, Bengaluru, Chennai"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              State *
            </label>
            <select
              required
              value={memberState}
              onChange={(e) => setMemberState(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 bg-white outline-none focus:border-[var(--imotora-red)]"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests Multi-Select */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-2">
            Your Interests *{" "}
            <span className="font-normal normal-case text-zinc-500">
              (select all that apply)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = memberInterests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    selected
                      ? "bg-[#0D0D10] text-white border-[#0D0D10]"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-[#0D0D10]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {interest}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-500">
            Your phone &amp; email stay private — only anonymous category &amp; interest
            totals appear in public stats.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="imotora-btn-primary px-6 py-2.5 text-xs sm:text-sm"
          >
            {submitting ? "Saving Profile..." : "Join iMotora Community →"}
          </button>
        </div>
      </form>
    </div>
  )
}
