import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About iMotora",
  description: "Learn about iMotora — India's home for automotive die-cast collectibles, racing tracks, and museum-grade displays.",
}

export default function AboutPage() {
  return (
    <div className="bg-[#0B0B0E] text-white py-12">
      <div className="content-container space-y-12">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[300px] flex items-center">
          <img
            src="/images/hero-ferrari.jpg"
            alt="iMotora Showroom"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-[#0B0B0E]/80 to-transparent" />
          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
            <span className="text-xs font-bold tracking-[0.25em] text-[#E11D2E] uppercase">
              Collect &bull; Race &bull; Display
            </span>
            <h1 className="font-racing text-4xl sm:text-5xl font-black leading-tight">
              Built By Enthusiasts, For <span className="text-[#E11D2E]">Collectors.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              iMotora was founded with one mission: bring world-class 1:64, 1:43, and 1:18 scale
              die-cast cars, high-speed racing tracks, and dust-free LED display garages to
              automotive lovers across India — packaged in mint collector condition.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "100% Authentic Models",
              desc: "Every Ferrari, Porsche, Lamborghini, Formula 1, and Hot Wheels Premium release is sourced directly from authorized distributors.",
            },
            {
              title: "Mint-Box Packaging",
              desc: "We ship every model inside reinforced collector cartons with multi-layer bubble cushioning so blisters and acrylic plinths arrive spotless.",
            },
            {
              title: "Curated iMotora Originals",
              desc: "From LED mini garages to exclusive numbered drops, our in-house Originals line is designed to elevate every shelf and desk.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#141418] border border-white/10 rounded-xl p-6 space-y-2"
            >
              <h3 className="font-racing text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <LocalizedClientLink href="/store" className="imotora-btn-primary px-7 py-3 text-sm">
            Explore Our Showroom →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

