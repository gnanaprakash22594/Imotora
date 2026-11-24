import LocalizedClientLink from "@modules/common/components/localized-client-link"

const COLLECTIONS = [
  {
    title: "Motorsport",
    handle: "motorsport",
    image: "/images/col-motorsport.jpg",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V4m0 0l6-1 6 2 6-1v10l-6 1-6-2-6 1" />
      </svg>
    ),
  },
  {
    title: "Classics",
    handle: "classics",
    image: "/images/col-classics.jpg",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 18h16M6 18V9m4 9V9m4 9V9m4 9V9M3 9l9-6 9 6" />
      </svg>
    ),
  },
  {
    title: "Supercars",
    handle: "supercars",
    image: "/images/col-supercars.jpg",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Racing Legends",
    handle: "racing-legends",
    image: "/images/col-rally.jpg",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 21h8m-4-4v4m-5-9a5 5 0 0010 0V5H7v7zm10-5h2a2 2 0 010 4h-2M7 7H5a2 2 0 000 4h2"
        />
      </svg>
    ),
  },
]

export default function CollectionsShowcase() {
  return (
    <section
      className="py-10 transition-colors"
      style={{ backgroundColor: "var(--section-light-bg)" }}
    >
      <div className="content-container">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="font-racing text-2xl sm:text-3xl font-extrabold tracking-tight whitespace-nowrap">
              <span style={{ color: "var(--text-main)" }}>Explore Our </span>
              <span style={{ color: "var(--imotora-red)" }}>Collections</span>
            </h2>
            <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-[var(--imotora-red)]/40 to-transparent" />
          </div>
          <LocalizedClientLink
            href="/store"
            className="text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[var(--imotora-red)]"
            style={{ color: "var(--text-main)" }}
          >
            View All Collections <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLLECTIONS.map((col) => (
            <LocalizedClientLink
              key={col.handle}
              href={`/collections/${col.handle}`}
              className="group relative h-[175px] rounded-xl overflow-hidden border-2 border-[#0D0D10]/10 hover:border-[var(--imotora-red)] shadow-md hover:shadow-xl transition-all duration-300 block bg-[#0D0D10]"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:bg-[var(--imotora-red)] group-hover:border-[var(--imotora-red)] transition-colors">
                  {col.icon}
                </span>
                <h3 className="text-base font-extrabold text-white group-hover:text-[var(--imotora-red)] transition-colors">
                  {col.title}
                </h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
