"use client"

import React, { useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "@lib/context/wishlist-context"

type NavCategory = {
  id: string
  name: string
  handle: string
}

type NavCollection = {
  id: string
  title: string
  handle: string
}

export default function ImotoraNavClient({
  categories,
  collections,
  cartSlot,
}: {
  categories: NavCategory[]
  collections: NavCollection[]
  cartSlot: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"
  const { count: wishlistCount } = useWishlist()

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)

  const isHome =
    pathname === `/${countryCode}` || pathname === `/${countryCode}/` || pathname === "/"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/${countryCode}/store?q=${encodeURIComponent(q)}`)
      setMobileMenuOpen(false)
    } else {
      router.push(`/${countryCode}/store`)
    }
  }

  const defaultCategories: NavCategory[] =
    categories.length > 0
      ? categories
      : [
          { id: "1", name: "Diecast Cars", handle: "diecast-cars" },
          { id: "2", name: "Racing Tracks", handle: "racing-tracks" },
          { id: "3", name: "Display & Garage", handle: "display-garage" },
          { id: "4", name: "Collector Accessories", handle: "collector-accessories" },
        ]

  const defaultCollections: NavCollection[] =
    collections.length > 0
      ? collections.filter((c) => c.handle !== "featured")
      : [
          { id: "1", title: "Motorsport", handle: "motorsport" },
          { id: "2", title: "Classics", handle: "classics" },
          { id: "3", title: "Supercars", handle: "supercars" },
          { id: "4", title: "Racing Legends", handle: "racing-legends" },
          { id: "5", title: "iMotora Originals", handle: "imotora-originals" },
        ]

  return (
    <div className="sticky top-0 inset-x-0 z-50 shadow-sm">
      {/* Top Announcement Bar — Lamborghini Red */}
      <div
        className="text-white text-xs sm:text-[13px]"
        style={{ backgroundColor: "var(--imotora-red)" }}
      >
        <div className="content-container flex items-center justify-between py-2 gap-3">
          <div className="hidden md:block w-24" />
          <div className="flex items-center justify-center gap-2 text-center font-medium tracking-wide truncate">
            <svg
              className="w-4 h-4 shrink-0 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8m16 0H4m16 0l-1.5-4.5A2 2 0 0016.6 6H7.4a2 2 0 00-1.9 1.5L4 12m8-6V3m0 3c-1.5 0-3-1-3-2.5S10.5 2 12 4m0 2c1.5 0 3-1 3-2.5S13.5 2 12 4"
              />
            </svg>
            <span className="truncate">
              Free Shipping on orders above <strong className="font-bold">₹999</strong>
              <span className="mx-2 opacity-75">|</span>
              New Arrivals &amp; <strong className="font-semibold">Pre-Orders Open Now!</strong>
            </span>
          </div>
          <LocalizedClientLink
            href="/store"
            className="shrink-0 inline-flex items-center gap-1 font-bold hover:underline whitespace-nowrap"
          >
            Shop Now <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Main Header — Pure Crisp White behind the Official iMotora Logo */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <nav className="content-container flex items-center justify-between h-[76px] gap-4">
          {/* Brand Logo on Clean White */}
          <LocalizedClientLink
            href="/"
            className="flex flex-col items-start shrink-0 group"
            data-testid="nav-store-link"
          >
            <img
              src="/images/imotora-logo.png"
              alt="iMotora"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.22em] text-zinc-700 uppercase mt-0.5 pl-1">
              COLLECT &bull; RACE &bull; DISPLAY
            </span>
          </LocalizedClientLink>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#111114]">
            <LocalizedClientLink
              href="/"
              className={`relative py-2 transition-colors hover:text-[var(--imotora-red)] ${
                isHome
                  ? "text-[#0D0D10] font-bold after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2.5px] after:bg-[var(--imotora-red)]"
                  : ""
              }`}
            >
              Home
            </LocalizedClientLink>

            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <LocalizedClientLink
                href="/store"
                className="flex items-center gap-1 py-2 hover:text-[var(--imotora-red)] transition-colors"
              >
                Shop
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </LocalizedClientLink>
              {shopOpen && (
                <div className="absolute left-0 top-full pt-1 w-56 z-50">
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-xl py-2">
                    <LocalizedClientLink
                      href="/store"
                      className="block px-4 py-2 text-sm text-[#0D0D10] font-bold hover:bg-red-50 hover:text-[var(--imotora-red)] transition-colors"
                    >
                      All Collectibles
                    </LocalizedClientLink>
                    <div className="my-1 border-t border-zinc-100" />
                    {defaultCategories.map((cat) => (
                      <LocalizedClientLink
                        key={cat.id}
                        href={`/categories/${cat.handle}`}
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[var(--imotora-red)] transition-colors"
                      >
                        {cat.name}
                      </LocalizedClientLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <LocalizedClientLink
                href="/store"
                className="flex items-center gap-1 py-2 hover:text-[var(--imotora-red)] transition-colors"
              >
                Collections
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </LocalizedClientLink>
              {collectionsOpen && (
                <div className="absolute left-0 top-full pt-1 w-56 z-50">
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-xl py-2">
                    {defaultCollections.map((col) => (
                      <LocalizedClientLink
                        key={col.id}
                        href={`/collections/${col.handle}`}
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[var(--imotora-red)] transition-colors"
                      >
                        {col.title}
                      </LocalizedClientLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <LocalizedClientLink
              href="/blog"
              className="py-2 hover:text-[var(--imotora-red)] transition-colors"
            >
              Blog
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/community"
              className="py-2 hover:text-[var(--imotora-red)] transition-colors"
            >
              Community
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/about"
              className="py-2 hover:text-[var(--imotora-red)] transition-colors"
            >
              About
            </LocalizedClientLink>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-zinc-100 border border-zinc-200 focus-within:border-[var(--imotora-red)] focus-within:bg-white rounded-full px-3.5 py-1.5 w-52 xl:w-64 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-500 shrink-0 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cars, tracks..."
                className="bg-transparent text-xs sm:text-sm text-zinc-900 placeholder-zinc-500 outline-none w-full"
              />
            </form>

            {/* Account */}
            <LocalizedClientLink
              href="/account"
              aria-label="Account"
              data-testid="nav-account-link"
              className="p-2 text-[#111114] hover:text-[var(--imotora-red)] hover:bg-zinc-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </LocalizedClientLink>

            {/* Wishlist */}
            <LocalizedClientLink
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-[#111114] hover:text-[var(--imotora-red)] hover:bg-zinc-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: "var(--imotora-red)" }}
                >
                  {wishlistCount}
                </span>
              )}
            </LocalizedClientLink>

            {/* Cart Slot */}
            <div className="flex items-center">{cartSlot}</div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 text-[#111114] hover:bg-zinc-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-zinc-200 px-4 py-4 space-y-4 shadow-lg">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cars, tracks..."
                className="bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none w-full"
              />
              <button
                type="submit"
                className="text-xs font-bold pl-2"
                style={{ color: "var(--imotora-red)" }}
              >
                Search
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <LocalizedClientLink
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-900 font-semibold"
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-900 font-semibold"
              >
                Shop All
              </LocalizedClientLink>
              {defaultCategories.map((cat) => (
                <LocalizedClientLink
                  key={cat.id}
                  href={`/categories/${cat.handle}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md bg-zinc-50 text-zinc-700"
                >
                  {cat.name}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-50 text-zinc-900 font-semibold"
              >
                Blog &amp; F1 Encyclopedia
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-50 text-zinc-900 font-semibold"
              >
                Community Forum
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-50 text-zinc-700"
              >
                About iMotora
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-zinc-50 text-zinc-700"
              >
                Contact Us
              </LocalizedClientLink>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
