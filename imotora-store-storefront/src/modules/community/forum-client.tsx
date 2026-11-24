"use client"

import React, { useMemo, useState } from "react"
import {
  ForumReply,
  ForumThread,
  createForumThread,
  getForumThread,
  postForumReply,
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

export default function ForumClient({
  initialThreads,
  defaultAuthor,
}: {
  initialThreads: ForumThread[]
  defaultAuthor?: string
}) {
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")

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
      setReplyBody("")
    }
  }

  return (
    <div className="space-y-8">
      {/* Forum Hero Header */}
      <div className="rounded-2xl bg-[#0D0D10] text-white p-7 sm:p-10 border-b-4 border-[var(--imotora-red)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span
            className="inline-block px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-[0.22em] text-white"
            style={{ backgroundColor: "var(--imotora-red)" }}
          >
            iMotora Paddock Forum
          </span>
          <h1 className="font-racing text-3xl sm:text-5xl font-black leading-tight">
            Collector{" "}
            <span style={{ color: "var(--imotora-red)" }}>Community Forum</span>
          </h1>
          <p className="text-sm text-zinc-300">
            Show off your die-cast garage, debate Formula 1 race weekends, track upcoming 50%
            deposit pre-orders, and trade rare castings with fellow enthusiasts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="imotora-btn-primary px-6 py-3 text-sm self-start lg:self-center shadow-lg"
        >
          + Start New Discussion
        </button>
      </div>

      {/* Main Forum Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Sidebar */}
        <aside className="lg:col-span-3 bg-white text-zinc-900 rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full rounded-lg bg-zinc-100 border border-zinc-200 focus:border-[var(--imotora-red)] focus:bg-white px-3 py-2 text-xs text-zinc-900 outline-none"
          />
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                    active
                      ? "text-white shadow-sm"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                  style={active ? { backgroundColor: "var(--imotora-red)" } : undefined}
                >
                  <span>{cat}</span>
                  <span className="opacity-75 text-[11px]">
                    {cat === "All"
                      ? threads.length
                      : threads.filter((t) => t.category === cat).length}
                  </span>
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
              className="cursor-pointer bg-white text-zinc-900 rounded-xl border border-zinc-200 hover:border-[var(--imotora-red)] p-5 shadow-sm hover:shadow-md transition-all flex gap-4 items-start"
            >
              {/* Upvote Column */}
              <button
                type="button"
                onClick={(e) => handleUpvote(e, thread.id)}
                className="shrink-0 w-12 py-2 rounded-lg bg-zinc-100 hover:bg-[#0D0D10] hover:text-white flex flex-col items-center justify-center transition-colors"
                aria-label="Upvote discussion"
              >
                <span className="text-xs font-black leading-none">▲</span>
                <span className="text-xs font-extrabold mt-0.5">{thread.upvotes}</span>
              </button>

              {/* Thread Content */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
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

                <h2 className="text-base sm:text-lg font-extrabold text-[#0D0D10] leading-snug">
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
                    {(thread.reply_count ?? 0) === 1 ? "Reply" : "Replies"} &bull; Open Thread →
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
          <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
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
            <div className="px-6 py-4 bg-[#0D0D10] text-white flex items-center justify-between gap-4">
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

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <h2 className="font-racing text-2xl font-black text-[#0D0D10] leading-snug">
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

