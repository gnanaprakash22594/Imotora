"use client"

import React, { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/hero-ferrari.jpg",
    kicker: "The World of",
    titleWhite: "Automotive",
    titleRed: "Collectibles",
    subtitle: "Miniature Cars  •  Racing Tracks  •  Display Solutions",
    ctaLabel: "Explore Collections",
    ctaHref: "/store",
  },
  {
    id: 2,
    image: "/images/originals-porsche.jpg",
    kicker: "Pre-Orders Open Now",
    titleWhite: "iMotora",
    titleRed: "Originals",
    subtitle: "Precision 1:43 & 1:18 Scale  •  Numbered Editions  •  Insured Delivery",
    ctaLabel: "Pre-Order Originals",
    ctaHref: "/collections/imotora-originals",
  },
  {
    id: 3,
    image: "/images/col-motorsport.jpg",
    kicker: "Race-Ready Engineering",
    titleWhite: "Championship",
    titleRed: "Motorsport",
    subtitle: "Formula 1  •  GT3 Endurance  •  Rally Legends",
    ctaLabel: "Shop Motorsport",
    ctaHref: "/collections/motorsport",
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [paused])

  const slide = HERO_SLIDES[active]

  const prevSlide = () =>
    setActive((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const nextSlide = () => setActive((prev) => (prev + 1) % HERO_SLIDES.length)

  return (
    <section
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] overflow-hidden bg-[#0A0A0D]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === active ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={item.image}
            alt={`${item.titleWhite} ${item.titleRed}`}
            className="w-full h-full object-cover object-center scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D]/95 via-[#0A0A0D]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/80 via-transparent to-[#0A0A0D]/25" />
        </div>
      ))}

      <div className="relative z-10 content-container h-full flex flex-col justify-center">
        <div className="max-w-xl">
          <p className="font-racing text-2xl sm:text-3xl font-bold text-white/95 leading-tight drop-shadow">
            {slide.kicker}
          </p>
          <h1 className="font-racing text-4xl sm:text-6xl lg:text-[66px] font-black leading-[0.98] tracking-tight mt-1 drop-shadow-lg">
            <span className="text-white block">{slide.titleWhite}</span>
            <span className="block" style={{ color: "var(--imotora-red)" }}>
              {slide.titleRed}
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-200 font-medium tracking-wide">
            {slide.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LocalizedClientLink
              href={slide.ctaHref}
              className="imotora-btn-primary px-6 py-3 text-sm sm:text-base shadow-lg"
            >
              {slide.ctaLabel}
              <span aria-hidden="true">→</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-[#0D0D10] hover:bg-zinc-100 font-bold text-sm sm:text-base transition-colors"
            >
              Shop All Models
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Left / Right Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--imotora-red)] border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--imotora-red)] border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === active ? "w-7" : "w-2 bg-white/50 hover:bg-white/85"
            }`}
            style={idx === active ? { backgroundColor: "var(--imotora-red)" } : undefined}
          />
        ))}
      </div>
    </section>
  )
}
