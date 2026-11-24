"use client"

import React, { useState } from "react"
import {
  IMOTORA_THEMES,
  RED_SHADES,
  RedShadeId,
  useImotoraTheme,
} from "@lib/context/theme-context"

export default function ThemeExplorer() {
  const { theme, setTheme, redShade, setRedShade } = useImotoraTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 w-[310px] rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl overflow-hidden animate-fade-in-top">
          <div className="px-4 py-3 bg-[#0D0D10] text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Color Explorer
              </p>
              <p className="text-[11px] text-zinc-400">
                Red &bull; Black &bull; White Combinations
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white text-lg leading-none px-1"
              aria-label="Close color explorer"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Theme Combinations */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Layout Balance
              </p>
              {IMOTORA_THEMES.map((item) => {
                const active = theme === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      active
                        ? "border-[var(--imotora-red)] bg-red-50/60 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-400 bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900">{item.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{item.tagline}</p>
                    </div>
                    <div className="flex items-center -space-x-1 shrink-0">
                      {item.swatches.map((hex, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-zinc-300 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Lamborghini Red Swatches */}
            <div className="pt-3 border-t border-zinc-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Lamborghini Red Tone
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(RED_SHADES) as RedShadeId[]).map((id) => {
                  const s = RED_SHADES[id]
                  const active = redShade === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRedShade(id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        active
                          ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <span
                        className="block w-full h-5 rounded-md mb-1"
                        style={{ backgroundColor: s.hex }}
                      />
                      <span className="block text-[10px] font-bold text-zinc-800 leading-tight">
                        {s.name.split(" ").slice(-1)[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0D0D10] hover:bg-black text-white text-xs font-bold shadow-xl border border-white/15 transition-all active:scale-95"
      >
        <span className="flex items-center -space-x-1">
          <span className="w-3.5 h-3.5 rounded-full bg-[var(--imotora-red)] border border-white/60" />
          <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-400" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#18181F] border border-white/60" />
        </span>
        <span>Explore Colors</span>
      </button>
    </div>
  )
}

