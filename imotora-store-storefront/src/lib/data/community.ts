"use server"

import { sdk } from "@lib/config"

export type ImotoraArticle = {
  id: number
  slug: string
  type: "blog" | "encyclopedia"
  category: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  read_time: string
  specs_json?: Record<string, string>
  tags: string
  created_at: string
}

export type ForumThread = {
  id: number
  category: string
  title: string
  body: string
  author_name: string
  author_badge: string
  tag: string
  upvotes: number
  pinned: boolean
  reply_count?: number
  created_at: string
}

export type ForumReply = {
  id: number
  thread_id: number
  author_name: string
  body: string
  upvotes: number
  created_at: string
}

export type CommunityStats = {
  activity: {
    totalMembers: number
    statesCount: number
    citiesCount: number
    totalThreads: number
    totalReplies: number
    totalUpvotes: number
  }
  byCategory: { label: string; count: number }[]
  byInterest: { label: string; count: number }[]
  byState: { label: string; count: number }[]
  forumByCategory: { label: string; threads: number; replies: number }[]
}

export async function listArticles(params?: {
  type?: "blog" | "encyclopedia"
  category?: string
  q?: string
}): Promise<ImotoraArticle[]> {
  try {
    const res = await sdk.client.fetch<{ posts: ImotoraArticle[] }>(
      `/store/content/posts`,
      {
        method: "GET",
        query: {
          ...(params?.type ? { type: params.type } : {}),
          ...(params?.category && params.category !== "All"
            ? { category: params.category }
            : {}),
          ...(params?.q ? { q: params.q } : {}),
        },
        cache: "no-store",
      }
    )
    return res.posts || []
  } catch {
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<ImotoraArticle | null> {
  try {
    const res = await sdk.client.fetch<{ post: ImotoraArticle }>(
      `/store/content/posts/${encodeURIComponent(slug)}`,
      { method: "GET", cache: "no-store" }
    )
    return res.post || null
  } catch {
    return null
  }
}

export async function listForumThreads(params?: {
  category?: string
  q?: string
}): Promise<ForumThread[]> {
  try {
    const res = await sdk.client.fetch<{ threads: ForumThread[] }>(
      `/store/community/threads`,
      {
        method: "GET",
        query: {
          ...(params?.category && params.category !== "All"
            ? { category: params.category }
            : {}),
          ...(params?.q ? { q: params.q } : {}),
        },
        cache: "no-store",
      }
    )
    return res.threads || []
  } catch {
    return []
  }
}

export async function createForumThread(input: {
  category: string
  title: string
  body: string
  author_name: string
  tag?: string
}): Promise<{ ok: boolean; thread?: ForumThread; error?: string }> {
  try {
    const res = await sdk.client.fetch<{ thread: ForumThread }>(
      `/store/community/threads`,
      { method: "POST", body: input }
    )
    return { ok: true, thread: res.thread }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to post thread" }
  }
}

export async function getForumThread(id: number): Promise<{
  thread: ForumThread | null
  replies: ForumReply[]
}> {
  try {
    const res = await sdk.client.fetch<{ thread: ForumThread; replies: ForumReply[] }>(
      `/store/community/threads/${id}`,
      { method: "GET", cache: "no-store" }
    )
    return { thread: res.thread || null, replies: res.replies || [] }
  } catch {
    return { thread: null, replies: [] }
  }
}

export async function postForumReply(input: {
  threadId: number
  author_name: string
  body: string
}): Promise<{ ok: boolean; reply?: ForumReply; error?: string }> {
  try {
    const res = await sdk.client.fetch<{ reply: ForumReply }>(
      `/store/community/threads/${input.threadId}`,
      {
        method: "POST",
        body: {
          action: "reply",
          author_name: input.author_name,
          body: input.body,
        },
      }
    )
    return { ok: true, reply: res.reply }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to post reply" }
  }
}

export async function upvoteForumThread(threadId: number): Promise<number | null> {
  try {
    const res = await sdk.client.fetch<{ thread: ForumThread }>(
      `/store/community/threads/${threadId}`,
      { method: "POST", body: { action: "upvote" } }
    )
    return res.thread?.upvotes ?? null
  } catch {
    return null
  }
}

export async function getCommunityStats(): Promise<CommunityStats | null> {
  try {
    const res = await sdk.client.fetch<{ stats: CommunityStats }>(
      `/store/community/members`,
      { method: "GET", cache: "no-store" }
    )
    return res.stats || null
  } catch {
    return null
  }
}

export async function registerCommunityMember(input: {
  full_name: string
  member_type: string
  phone: string
  email: string
  city: string
  state: string
  interests: string[]
}): Promise<{ ok: boolean; stats?: CommunityStats; error?: string }> {
  try {
    const res = await sdk.client.fetch<{ stats: CommunityStats }>(
      `/store/community/members`,
      { method: "POST", body: input }
    )
    return { ok: true, stats: res.stats }
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Failed to save community profile",
    }
  }
}

