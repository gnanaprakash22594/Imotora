import { Metadata } from "next"
import { listForumThreads } from "@lib/data/community"
import { retrieveCustomer } from "@lib/data/customer"
import ForumClient from "@modules/community/forum-client"

export const metadata: Metadata = {
  title: "Collector Community Forum",
  description:
    "Join the iMotora Community Forum — share your die-cast garage, discuss Formula 1 race weekends, track pre-orders, and connect with collectors.",
}

export default async function CommunityPage() {
  const [threads, customer] = await Promise.all([
    listForumThreads(),
    retrieveCustomer().catch(() => null),
  ])

  const defaultAuthor = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email
    : ""

  return (
    <div
      className="py-10 min-h-[75vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
    >
      <div className="content-container">
        <ForumClient initialThreads={threads} defaultAuthor={defaultAuthor} />
      </div>
    </div>
  )
}

