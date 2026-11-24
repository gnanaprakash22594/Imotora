"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type WishlistItem = {
  id: string
  handle: string
  title: string
  thumbnail?: string | null
  price?: string
  variantId?: string
}

type WishlistContextType = {
  items: WishlistItem[]
  toggleItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isWishlisted: (id: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  toggleItem: () => {},
  removeItem: () => {},
  isWishlisted: () => false,
  count: 0,
})

const STORAGE_KEY = "imotora_wishlist_v1"

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items, hydrated])

  const toggleItem = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id)
      if (exists) {
        return prev.filter((i) => i.id !== item.id)
      }
      return [item, ...prev]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const isWishlisted = (id: string) => items.some((i) => i.id === id)

  return (
    <WishlistContext.Provider
      value={{ items, toggleItem, removeItem, isWishlisted, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}

