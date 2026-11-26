"use client"

import React, { useMemo, useState } from "react"
import {
  CommunityStats,
  ForumReply,
  ForumThread,
  createForumThread,
  getForumThread,
  postForumReply,
  registerCommunityMember,
  upvoteForumThread,
} from "@lib/data/community"

const CATEGORIES = [
  "All",
  "Show Your Garage",
  "F1 Race Talk",
  "Pre-Order Watch",
  "Display & DIY Tracks",
  "Buy / Trade / ISO",
]

const MEMBER_CATEGORIES = [
  "Hobbyist",
  "Collector",
  "Wholesaler",
  "Retailer",
  "Track Builder",
  "Reseller / Trader",
]

const INTEREST_OPTIONS = [
  "1:64 Die-Cast",
  "1:43 F1 & Motorsport",
  "1:18 Scale Models",
  "Racing Tracks",
  "LED Displays & Dioramas",
  "Vintage & Classics",
  "Bulk / Wholesale",
]

const INDIAN_STATES = [
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

export default function ForumClient({
  initialThreads,
  initialStats,
  defaultAuthor,
  defaultEmail,
  defaultPhone,
}: {
  initialThreads: ForumThread[]
  initialStats: CommunityStats | null
  defaultAuthor?: string
  defaultEmail?: string
  defaultPhone?: string
}) {
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads)
  const [stats, setStats] = useState<CommunityStats | null>(initialStats)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")

  // Community Member Profile Form State
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [memberName, setMemberName] = useState(defaultAuthor || "")
  const [memberType, setMemberType] = useState("Hobbyist")
  const [memberPhone, setMemberPhone] = useState(defaultPhone || "")
  const [memberEmail, setMemberEmail] = useState(defaultEmail || "")
  const [memberCity, setMemberCity] = useState("")
  const [memberState, setMemberState] = useState("Maharashtra")
  const [memberInterests, setMemberInterests] = useState<string[]>([
    "1:64 Die-Cast",
  ])
  const [submittingProfile, setSubmittingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // New Thread Modal State
  const [showNewModal, setShowNewModal] = useState(false)
  const [newCategory, setNewCategory] = useState("F1 Race Talk")
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [newAuthor, setNewAuthor] = useState(defaultAuthor || "")
  const [newTag, setNewTag] = useState("")
  const [submittingThread, setSubmittingThread] = useState(false)

  // Active Thread Detail & Replies State
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyBody, setReplyBody] = useState("")
  const [replyAuthor, setReplyAuthor] = useState(defaultAuthor || "")
  const [submittingReply, setSubmittingReply] = useState(false)

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const catMatch = selectedCategory === "All" || t.category === selectedCategory
      const q = search.trim().toLowerCase()
      const qMatch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.author_name.toLowerCase().includes(q)
      return catMatch && qMatch
    })
  }, [threads, selectedCategory, search])

  // Live computed activity fallback if backend stats are still warming up
  const liveActivity = useMemo(() => {
    const threadReplies = threads.reduce((acc, t) => acc + (t.reply_count || 0), 0)
    const threadUpvotes = threads.reduce((acc, t) => acc + (t.upvotes || 0), 0)
    return {
      totalMembers: stats?.activity.totalMembers ?? 0,
      statesCount: stats?.activity.statesCount ?? 0,
      citiesCount: stats?.activity.citiesCount ?? 0,
      totalThreads: Math.max(stats?.activity.totalThreads ?? 0, threads.length),
      totalReplies: Math.max(stats?.activity.totalReplies ?? 0, threadReplies),
      totalUpvotes: Math.max(stats?.activity.totalUpvotes ?? 0, threadUpvotes),
    }
  }, [stats, threads])

  const maxCategoryCount = Math.max(
    ...(stats?.byCategory.map((c) => c.count) || [1]),
    1
  )
  const maxInterestCount = Math.max(
    ...(stats?.byInterest.map((i) => i.count) || [1]),
    1
  )

  const toggleInterest = (interest: string) => {
    setMemberInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    )
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)

    if (!memberInterests.length) {
      setProfileError("Please select at least one interest.")
      return
    }

    setSubmittingProfile(true)
    const res = await registerCommunityMember({
      full_name: memberName.trim(),
      member_type: memberType,
      phone: memberPhone.trim(),
      email: memberEmail.trim(),
      city: memberCity.trim(),
      state: memberState,
      interests: memberInterests,
    })
    setSubmittingProfile(false)

    if (!res.ok) {
      setProfileError(res.error || "Could not save your profile. Please try again.")
      return
    }

    if (res.stats) {
      setStats(res.stats)
    }
    if (memberName.trim()) {
      setNewAuthor(memberName.trim())
      setReplyAuthor(memberName.trim())
    }
    setProfileSuccess(
      `Welcome ${memberName.trim()}! You're registered as a ${memberType} from ${memberCity.trim()}, ${memberState}.`
    )
  }

  const openThread = async (thread: ForumThread) => {
    setActiveThread(thread)
    setLoadingReplies(true)
    const data = await getForumThread(thread.id)
    setReplies(data.replies || [])
    setLoadingReplies(false)
  }

  const handleUpvote = async (e: React.MouseEvent, threadId: number) => {
    e.stopPropagation()
    const nextUpvotes = await upvoteForumThread(threadId)
    if (nextUpvotes !== null) {
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, upvotes: nextUpvotes } : t))
      )
      if (activeThread?.id === threadId) {
        setActiveThread((prev) => (prev ? { ...prev, upvotes: nextUpvotes } : null))
      }
      setStats((prev) =>
        prev
          ? {
              ...prev,
              activity: {
                ...prev.activity,
                totalUpvotes: prev.activity.totalUpvotes + 1,
              },
            }
          : prev
      )
    }
  }

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return
    setSubmittingThread(true)
    const res = await createForumThread({
      category: newCategory,
      title: newTitle.trim(),
      body: newBody.trim(),
      author_name: newAuthor.trim() || "iMotora Collector",
      tag: newTag.trim(),
    })
    setSubmittingThread(false)
    if (res.ok && res.thread) {
      setThreads((prev) => [res.thread!, ...prev])
      setStats((prev) =>
        prev
          ? {
              ...prev,
              activity: {
                ...prev.activity,
                totalThreads: prev.activity.totalThreads + 1,
                totalUpvotes: prev.activity.totalUpvotes + 1,
              },
            }
          : prev
      )
      setNewTitle("")
      setNewBody("")
      setNewTag("")
      setShowNewModal(false)
    }
  }

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThread || !replyBody.trim()) return
    setSubmittingReply(true)
    const res = await postForumReply({
      threadId: activeThread.id,
      author_name: replyAuthor.trim() || "iMotora Collector",
      body: replyBody.trim(),
    })
    setSubmittingReply(false)
    if (res.ok && res.reply) {
      setReplies((prev) => [...prev, res.reply!])
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? { ...t, reply_count: (t.reply_count || 0) + 1 }
            : t
        )
      )
      setStats((prev) =>
        prev
          ? {
              ...prev,
              activity: {
                ...prev.activity,
                totalReplies: prev.activity.totalReplies + 1,
              },
            }
          : prev
      )
      setReplyBody("")
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Forum Hero Header */}
      <div className="rounded-2xl bg-[#0D0D10] text-white p-6 sm:p-10 border-b-4 border-[var(--imotora-red)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <span
            className="inline-block px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-[0.22em] text-white"
            style={{ backgroundColor: "var(--imotora-red)" }}
          >
            iMotora Paddock Community
          </span>
          <h1 className="font-racing text-3xl sm:text-5xl font-black leading-tight">
            Collector{" "}
            <span style={{ color: "var(--imotora-red)" }}>Community Forum</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Register your collector or trade profile (Hobbyist, Collector, Wholesaler,
            Retailer &amp; more), track live community stats across India, and join
            die-cast &amp; F1 discussions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            onClick={() => {
              setShowProfileForm((v) => !v)
              setProfileSuccess(null)
              setProfileError(null)
            }}
            className="imotora-btn-primary px-5 py-2.5 text-xs sm:text-sm shadow-lg"
          >
            {showProfileForm ? "Hide Member Form" : "Join Community Profile"}
          </button>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 rounded-md bg-white text-[#0D0D10] hover:bg-zinc-100 font-bold text-xs sm:text-sm transition-colors"
          >
            + Start Discussion
          </button>
        </div>
      </div>

      {/* Live Forum Activity & Member Stats Dashboard */}
      <section className="space-y-4">
        {/* 4 Activity KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white text-zinc-900 rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Community Members
            </p>
            <p className="font-racing text-3xl sm:text-4xl font-black text-[#0D0D10] mt-1">
              {liveActivity.totalMembers}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Across {liveActivity.citiesCount} cities &bull; {liveActivity.statesCount}{" "}
              states
            </p>
          </div>

          <div className="bg-white text-zinc-900 rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Forum Discussions
            </p>
            <p className="font-racing text-3xl sm:text-4xl font-black text-[#0D0D10] mt-1">
              {liveActivity.totalThreads}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Active collector threads
            </p>
          </div>

          <div className="bg-white text-zinc-900 rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Total Replies
            </p>
            <p className="font-racing text-3xl sm:text-4xl font-black text-[#0D0D10] mt-1">
              {liveActivity.totalReplies}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Community responses
            </p>
          </div>

          <div className="bg-white text-zinc-900 rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Forum Upvotes
            </p>
            <p
              className="font-racing text-3xl sm:text-4xl font-black mt-1"
              style={{ color: "var(--imotora-red)" }}
            >
              {liveActivity.totalUpvotes}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Total community activity
            </p>
          </div>
        </div>

        {/* Category & Interest Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Members by Category (Hobbyist, Collector, Wholesaler, etc.) */}
          <div className="bg-white text-zinc-900 rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="font-racing text-lg sm:text-xl font-black text-[#0D0D10]">
                  Members by{" "}
                  <span style={{ color: "var(--imotora-red)" }}>Category</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Hobbyists, collectors, wholesalers, retailers &amp; builders
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-700 shrink-0">
                {liveActivity.totalMembers} Total
              </span>
            </div>

            <div className="space-y-3">
              {(stats?.byCategory?.length
                ? stats.byCategory
                : MEMBER_CATEGORIES.map((label) => ({ label, count: 0 }))
              ).map((item) => {
                const pct =
                  liveActivity.totalMembers > 0
                    ? Math.round((item.count / liveActivity.totalMembers) * 100)
                    : 0
                const barWidth = Math.max(
                  Math.round((item.count / maxCategoryCount) * 100),
                  item.count > 0 ? 12 : 0
                )
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800">{item.label}</span>
                      <span className="font-extrabold text-[#0D0D10]">
                        {item.count}{" "}
                        <span className="text-zinc-400 font-semibold">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: "var(--imotora-red)",
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {stats?.byState && stats.byState.length > 0 && (
              <div className="pt-3 border-t border-zinc-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Top States Represented
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stats.byState.map((s) => (
                    <span
                      key={s.label}
                      className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold"
                    >
                      {s.label} <strong className="text-[#0D0D10]">({s.count})</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Members by Interests */}
          <div className="bg-white text-zinc-900 rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="font-racing text-lg sm:text-xl font-black text-[#0D0D10]">
                  Members by{" "}
                  <span style={{ color: "var(--imotora-red)" }}>Interests</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Popular scales, motorsport &amp; trade interests across members
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#0D0D10] text-white text-[11px] font-bold shrink-0">
                Live Stats
              </span>
            </div>

            <div className="space-y-3">
              {(stats?.byInterest?.length
                ? stats.byInterest
                : INTEREST_OPTIONS.map((label) => ({ label, count: 0 }))
              ).map((item) => {
                const barWidth = Math.max(
                  Math.round((item.count / maxInterestCount) * 100),
                  item.count > 0 ? 12 : 0
                )
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800">{item.label}</span>
                      <span className="font-extrabold text-[#0D0D10]">
                        {item.count}{" "}
                        <span className="text-zinc-400 font-semibold">
                          {item.count === 1 ? "member" : "members"}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0D0D10] transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Community Member Registration Card (Always Easy to Open + Prominent Banner) */}
      <section className="bg-white text-zinc-900 rounded-2xl border-2 border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 sm:px-6 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-racing text-xl sm:text-2xl font-black text-[#0D0D10]">
              Register Your{" "}
              <span style={{ color: "var(--imotora-red)" }}>Community Profile</span>
            </h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              Tell us whether you&apos;re a Hobbyist, Collector, Wholesaler, or Retailer —
              share your city, state &amp; interests to join the iMotora network.
            </p>
          </div>
          {!showProfileForm && (
            <button
              type="button"
              onClick={() => setShowProfileForm(true)}
              className="imotora-btn-primary px-5 py-2.5 text-xs shrink-0 self-start sm:self-center"
            >
              Fill Community Form →
            </button>
          )}
        </div>

        {(showProfileForm || profileSuccess) && (
          <div className="p-5 sm:p-6">
            {profileSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 flex items-center justify-between gap-3">
                <span>✓ {profileSuccess}</span>
                <button
                  type="button"
                  onClick={() => setProfileSuccess(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold text-base leading-none"
                >
                  ×
                </button>
              </div>
            )}

            {profileError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs sm:text-sm font-semibold text-red-700">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
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
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
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
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
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
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
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
                  disabled={submittingProfile}
                  className="imotora-btn-primary px-6 py-2.5 text-xs sm:text-sm"
                >
                  {submittingProfile ? "Saving Profile..." : "Join iMotora Community →"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Main Forum Discussions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Category Filter (Compact Chips on Mobile, Sidebar on Desktop) */}
        <aside className="lg:col-span-3 bg-white text-zinc-900 rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full rounded-lg bg-zinc-100 border border-zinc-200 focus:border-[var(--imotora-red)] focus:bg-white px-3 py-2 text-xs text-zinc-900 outline-none"
          />
          <div className="flex flex-wrap lg:flex-col gap-1.5 lg:gap-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat
              const count =
                cat === "All"
                  ? threads.length
                  : threads.filter((t) => t.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`lg:w-full text-left px-3 py-1.5 lg:py-2 rounded-full lg:rounded-lg text-xs font-bold transition-colors flex items-center justify-between gap-2 ${
                    active
                      ? "text-white shadow-sm"
                      : "bg-zinc-100 lg:bg-transparent text-zinc-700 hover:bg-zinc-200 lg:hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                  style={active ? { backgroundColor: "var(--imotora-red)" } : undefined}
                >
                  <span>{cat}</span>
                  <span className="opacity-75 text-[11px]">{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Thread Feed */}
        <div className="lg:col-span-9 space-y-3">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => openThread(thread)}
              className="cursor-pointer bg-white text-zinc-900 rounded-xl border border-zinc-200 hover:border-[var(--imotora-red)] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex gap-3 sm:gap-4 items-start"
            >
              {/* Upvote Column */}
              <button
                type="button"
                onClick={(e) => handleUpvote(e, thread.id)}
                className="shrink-0 w-11 sm:w-12 py-2 rounded-lg bg-zinc-100 hover:bg-[#0D0D10] hover:text-white flex flex-col items-center justify-center transition-colors"
                aria-label="Upvote discussion"
              >
                <span className="text-xs font-black leading-none">▲</span>
                <span className="text-xs font-extrabold mt-0.5">{thread.upvotes}</span>
              </button>

              {/* Thread Content */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
                  {thread.pinned && (
                    <span
                      className="px-2 py-0.5 rounded text-white font-extrabold uppercase tracking-wider text-[10px]"
                      style={{ backgroundColor: "var(--imotora-red)" }}
                    >
                      Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-[#0D0D10] text-white font-bold text-[10px]">
                    {thread.category}
                  </span>
                  {thread.tag && (
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold text-[10px]">
                      #{thread.tag}
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-lg font-extrabold text-[#0D0D10] leading-snug">
                  {thread.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                  {thread.body}
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800">{thread.author_name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-semibold">
                      {thread.author_badge}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-700">
                    💬 {thread.reply_count ?? 0}{" "}
                    {(thread.reply_count ?? 0) === 1 ? "Reply" : "Replies"} &bull; Open →
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredThreads.length === 0 && (
            <div className="bg-white text-zinc-900 rounded-xl p-10 text-center border border-zinc-200 space-y-3">
              <p className="font-bold text-base">No discussions match your filter yet.</p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="imotora-btn-primary px-5 py-2 text-xs"
              >
                Start the First Discussion →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create New Thread Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-racing text-xl font-black text-[#0D0D10]">
                Start a New <span style={{ color: "var(--imotora-red)" }}>Discussion</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateThread} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 bg-white outline-none focus:border-[var(--imotora-red)]"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best 1:43 Ferrari F1 casting under ₹3,000?"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Car / Scale Tag (optional)
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. 1:43 F1, Ferrari, Pre-Order"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share your thoughts, garage details, or question..."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingThread}
                  className="imotora-btn-primary px-5 py-2 text-xs"
                >
                  {submittingThread ? "Posting..." : "Publish Thread →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread Detail & Live Replies Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 bg-[#0D0D10] text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0"
                  style={{ backgroundColor: "var(--imotora-red)" }}
                >
                  {activeThread.category}
                </span>
                <span className="text-xs text-zinc-400 truncate">
                  Posted by {activeThread.author_name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveThread(null)}
                className="text-zinc-400 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <h2 className="font-racing text-xl sm:text-2xl font-black text-[#0D0D10] leading-snug">
                  {activeThread.title}
                </h2>
                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                  {activeThread.body}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleUpvote(e, activeThread.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-[#0D0D10] hover:text-white text-xs font-extrabold transition-colors"
                  >
                    ▲ Upvote ({activeThread.upvotes})
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5 space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                  Replies ({replies.length})
                </h3>

                {loadingReplies ? (
                  <p className="text-xs text-zinc-500">Loading discussion...</p>
                ) : replies.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    No replies yet — be the first collector to respond!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {replies.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 space-y-1.5"
                      >
                        <p className="text-xs font-extrabold text-[#0D0D10]">{r.author_name}</p>
                        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                          {r.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Composer */}
            <form
              onSubmit={handlePostReply}
              className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="Your name"
                  className="sm:w-40 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                />
                <input
                  type="text"
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Write a reply to this thread..."
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[var(--imotora-red)]"
                />
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="imotora-btn-primary px-4 py-2 text-xs shrink-0"
                >
                  {submittingReply ? "Posting..." : "Reply →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
