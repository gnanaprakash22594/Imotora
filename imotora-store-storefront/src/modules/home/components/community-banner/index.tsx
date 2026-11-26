"use client"

import React, { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CommunityProfileForm from "@modules/community/community-profile-form"

export default function CommunityBanner() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section
      className="py-10 transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)" }}
    >
      <div className="content-container space-y-5">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10"
          style={{ backgroundColor: "var(--community-bg)", color: "var(--community-text)" }}
        >
          {/* Subtle diagonal racing accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/45 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-block px-2.5 py-1 rounded bg-black/30 text-white text-[10px] font-extrabold uppercase tracking-[0.2em]">
                Collectors Pit Club
              </span>
              <h2 className="font-racing text-2xl sm:text-3xl font-black leading-tight text-white">
                Join the iMotora Community
              </h2>
              <p className="text-sm text-white/90 leading-relaxed max-w-md">
                Register as a Hobbyist, Collector, Wholesaler, or Retailer — unlock early
                Pre-Order drops and connect with enthusiasts across India.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForm((v) => !v)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-[#0D0D10] font-extrabold px-5 sm:px-6 py-2.5 rounded-md text-sm shadow-lg transition-all active:scale-95"
                >
                  {showForm ? "Hide Community Form" : "Fill Community Form"}{" "}
                  <span aria-hidden="true">{showForm ? "↑" : "→"}</span>
                </button>
                <LocalizedClientLink
                  href="/community"
                  className="inline-flex items-center gap-2 bg-[#0D0D10] hover:bg-black text-white font-bold px-5 py-2.5 rounded-md text-sm shadow transition-all"
                >
                  View Stats &amp; Forum
                </LocalizedClientLink>
              </div>
            </div>

            {/* Center Collector Showcase Phone Mockup */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-[220px] sm:w-[250px] rounded-[24px] border-2 border-white/25 bg-[#0A0A0D] p-2.5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-[18px] overflow-hidden bg-white">
                  <div className="px-3 py-2 bg-white flex items-center justify-between border-b border-zinc-200">
                    <img
                      src="/images/imotora-logo.png"
                      alt="iMotora App"
                      className="h-4 w-auto object-contain"
                    />
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider"
                      style={{ color: "var(--imotora-red)" }}
                    >
                      Garage Club
                    </span>
                  </div>
                  <img
                    src="/images/hero-ferrari.jpg"
                    alt="iMotora Collector Showcase"
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-2.5 bg-[#0D0D10] flex items-center justify-between text-[10px]">
                    <span className="text-zinc-200 font-semibold">12 Models Tracked</span>
                    <span
                      className="px-2 py-0.5 rounded text-white font-bold"
                      style={{ backgroundColor: "var(--imotora-red)" }}
                    >
                      PRO
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Perks */}
            <div className="lg:col-span-3 space-y-4">
              {[
                {
                  label: "Hobbyist, Collector & Trade Network",
                  path: "M4 6h16M4 12h16M4 18h10",
                },
                {
                  label: "Early Pre-Order Access",
                  path: "M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z",
                },
                {
                  label: "Live Community Stats & Drops",
                  path: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z",
                },
              ].map((perk) => (
                <div key={perk.label} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#0D0D10] text-white flex items-center justify-center shrink-0 shadow">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={perk.path} />
                    </svg>
                  </span>
                  <span className="text-sm font-bold text-white">{perk.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inline Full Community Profile Form directly on the Home Page */}
          {showForm && (
            <div className="relative z-10 bg-white text-zinc-900 p-5 sm:p-7 border-t border-zinc-200">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-racing text-xl font-black text-[#0D0D10]">
                    Register Your{" "}
                    <span style={{ color: "var(--imotora-red)" }}>Community Profile</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Takes 30 seconds — your profile updates live on the Community page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-zinc-400 hover:text-zinc-900 text-xl leading-none px-1"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
              <CommunityProfileForm />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
