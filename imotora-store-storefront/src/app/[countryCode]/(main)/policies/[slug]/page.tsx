import { notFound } from "next/navigation"

const POLICIES: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  shipping: {
    title: "Shipping Policy",
    sections: [
      {
        heading: "Free Collector Shipping Above ₹999",
        body: "All orders above ₹999 qualify for complimentary insured collector shipping anywhere in India. Orders under ₹999 ship at a flat ₹99 standard rate, or upgrade to Express Insured Air Courier (₹249) for 24–48 hour priority dispatch.",
      },
      {
        heading: "Mint-Box Protection Guarantee",
        body: "Every die-cast car, blister card, and acrylic display case is double-wrapped in anti-static bubble cushioning inside a rigid corrugated box.",
      },
    ],
  },
  returns: {
    title: "Return & Refund Policy",
    sections: [
      {
        heading: "7-Day Hassle-Free Replacement",
        body: "If your collectible arrives damaged in transit or differs from your order, share an unboxing video within 48 hours of delivery for an instant free replacement or 100% refund.",
      },
      {
        heading: "Refund Processing",
        body: "Approved refunds are credited back to your original payment method (UPI, Card, or NetBanking) within 3–5 business days.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Your Data Stays Protected",
        body: "iMotora collects only the contact and shipping details required to fulfill your orders and notify you of new collector drops. We never sell or rent customer information.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      {
        heading: "Authentic Collectibles & Pricing",
        body: "All prices listed on iMotora are inclusive of applicable Indian GST. Limited edition iMotora Originals are fulfilled on a first-come, first-served basis.",
      },
    ],
  },
}

export default async function PolicyPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const policy = POLICIES[slug]
  if (!policy) return notFound()

  return (
    <div className="bg-[#0B0B0E] text-white py-12 min-h-[65vh]">
      <div className="content-container max-w-3xl space-y-8">
        <h1 className="font-racing text-3xl sm:text-4xl font-extrabold">
          {policy.title}
        </h1>
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {policy.sections.map((s) => (
            <div key={s.heading} className="space-y-2">
              <h2 className="text-lg font-bold text-white">{s.heading}</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

