import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  {
    title: "Racing Tracks",
    subtitle: "Build. Race. Enjoy.",
    handle: "racing-tracks",
    image: "/images/cat-tracks.jpg",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V4m0 0l6-1 6 2 6-1v10l-6 1-6-2-6 1" />
      </svg>
    ),
  },
  {
    title: "Diecast Cars",
    subtitle: "Iconic. Collectible.",
    handle: "diecast-cars",
    image: "/images/cat-diecast.jpg",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 17h14M6 17l1.5-6.5A2 2 0 019.45 9h5.1a2 2 0 011.95 1.5L18 17M7.5 17a1.5 1.5 0 11-3 0m15 0a1.5 1.5 0 11-3 0"
        />
      </svg>
    ),
  },
  {
    title: "Display & Garage",
    subtitle: "Showcase in Style.",
    handle: "display-garage",
    image: "/images/cat-display.jpg",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
  {
    title: "Collector Accessories",
    subtitle: "Complete Your Collection.",
    handle: "collector-accessories",
    image: "/images/cat-accessories.jpg",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
        />
      </svg>
    ),
  },
]

export default function CategoryShowcase() {
  return (
    <section
      className="py-10 transition-colors"
      style={{ backgroundColor: "var(--section-light-bg)" }}
    >
      <div className="content-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <LocalizedClientLink
              key={cat.handle}
              href={`/categories/${cat.handle}`}
              className="group relative h-[190px] rounded-xl overflow-hidden border-2 border-[#0D0D10]/10 hover:border-[var(--imotora-red)] shadow-md hover:shadow-xl transition-all duration-300 block bg-[#0D0D10]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-white mt-0.5 shrink-0">{cat.icon}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-[var(--imotora-red)] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5">{cat.subtitle}</p>
                  </div>
                </div>
                <span className="w-7 h-7 rounded-full bg-white/15 border border-white/30 group-hover:border-[var(--imotora-red)] group-hover:bg-[var(--imotora-red)] text-white flex items-center justify-center text-xs shrink-0 transition-all">
                  →
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
