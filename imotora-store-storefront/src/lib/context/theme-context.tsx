"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ImotoraThemeId =
  | "rosso-split"
  | "bianco-showroom"
  | "rosso-corsa-bold"
  | "nero-bianco"

export type RedShadeId = "lambo-rosso" | "rosso-bright" | "rosso-deep"

export const RED_SHADES: Record<
  RedShadeId,
  { name: string; hex: string; hover: string; soft: string }
> = {
  "lambo-rosso": {
    name: "Lamborghini Rosso Mars",
    hex: "#F01E00",
    hover: "#CC1800",
    soft: "rgba(240, 30, 0, 0.12)",
  },
  "rosso-bright": {
    name: "Rosso Anteros Bright",
    hex: "#FF2400",
    hover: "#D91E00",
    soft: "rgba(255, 36, 0, 0.12)",
  },
  "rosso-deep": {
    name: "Rosso Bia Deep",
    hex: "#D41600",
    hover: "#B01200",
    soft: "rgba(212, 22, 0, 0.12)",
  },
}

export const IMOTORA_THEMES: {
  id: ImotoraThemeId
  name: string
  tagline: string
  swatches: [string, string, string]
}[] = [
  {
    id: "rosso-split",
    name: "Rosso Split",
    tagline: "Equal Red, Black & White (Default)",
    swatches: ["#FFFFFF", "#0D0D10", "#F01E00"],
  },
  {
    id: "bianco-showroom",
    name: "White Showroom",
    tagline: "Crisp White canvas, Black type, Lambo Red",
    swatches: ["#FFFFFF", "#F4F4F6", "#F01E00"],
  },
  {
    id: "rosso-corsa-bold",
    name: "Rosso Bold",
    tagline: "High-impact Red bands + White & Black",
    swatches: ["#F01E00", "#FFFFFF", "#0D0D10"],
  },
  {
    id: "nero-bianco",
    name: "Stealth + White Bars",
    tagline: "White header/footer + Black showroom + Red",
    swatches: ["#0D0D10", "#FFFFFF", "#F01E00"],
  },
]

type ThemeContextType = {
  theme: ImotoraThemeId
  setTheme: (t: ImotoraThemeId) => void
  redShade: RedShadeId
  setRedShade: (r: RedShadeId) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "rosso-split",
  setTheme: () => {},
  redShade: "lambo-rosso",
  setRedShade: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ImotoraThemeId>("rosso-split")
  const [redShade, setRedShadeState] = useState<RedShadeId>("lambo-rosso")

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("imotora_theme") as ImotoraThemeId | null
      const savedRed = localStorage.getItem("imotora_red_shade") as RedShadeId | null
      if (savedTheme && IMOTORA_THEMES.some((t) => t.id === savedTheme)) {
        setThemeState(savedTheme)
      }
      if (savedRed && RED_SHADES[savedRed]) {
        setRedShadeState(savedRed)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-imotora-theme", theme)
    const shade = RED_SHADES[redShade]
    root.style.setProperty("--imotora-red", shade.hex)
    root.style.setProperty("--imotora-red-hover", shade.hover)
    root.style.setProperty("--imotora-red-soft", shade.soft)
  }, [theme, redShade])

  const setTheme = (t: ImotoraThemeId) => {
    setThemeState(t)
    try {
      localStorage.setItem("imotora_theme", t)
    } catch {}
  }

  const setRedShade = (r: RedShadeId) => {
    setRedShadeState(r)
    try {
      localStorage.setItem("imotora_red_shade", r)
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, redShade, setRedShade }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useImotoraTheme() {
  return useContext(ThemeContext)
}

