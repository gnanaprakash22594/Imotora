import { Metadata } from "next"
import { getCommunityStats, listForumThreads } from "@lib/data/community"
import { retrieveCustomer } from "@lib/data/customer"
import ForumClient from "@modules/community/forum-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Collector Community Forum",
  description:
    "Join the iMotora Community — register as a hobbyist, collector, retailer, or wholesaler, view live community stats, and join die-cast & F1 forum discussions.",
}

export default async function CommunityPage() {
  const [threads, stats, customer] = await Promise.all([
    listForumThreads(),
    getCommunityStats(),
    retrieveCustomer().catch(() => null),
  ])

  const defaultAuthor = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email
    : ""
  const defaultEmail = customer?.email || ""
  const defaultPhone = customer?.phone || ""

  return (
    <div
      className="py-6 sm:py-10 min-h-[75vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
    >
      <div className="content-container">
        <ForumClient
          initialThreads={threads}
          initialStats={stats}
          defaultAuthor={defaultAuthor}
          defaultEmail={defaultEmail}
          defaultPhone={defaultPhone}
        />
      </div>
    </div>
  )
}
