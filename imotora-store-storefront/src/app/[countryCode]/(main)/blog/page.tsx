import { Metadata } from "next"
import { listArticles } from "@lib/data/community"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Blog & F1 Encyclopedia",
  description:
    "Latest Formula 1 news, livery spotlights, collector guides, and the complete F1 Encyclopedia of racers, teams, and iconic championship cars.",
}

const NEWS_CATEGORIES = ["All", "F1 News", "Livery Spotlight", "Collector Guides", "Race Tech"]
const ENCYCLO_CATEGORIES = ["All", "F1 Racers", "F1 Teams", "F1 Cars"]

export default async function BlogPage(props: {
  searchParams: Promise<{ tab?: string; category?: string; q?: string }>
}) {
  const { tab = "news", category = "All", q } = await props.searchParams
  const isEncyclopedia = tab === "encyclopedia"

  const [newsPosts, encycloPosts] = await Promise.all([
    listArticles({ type: "blog", category: !isEncyclopedia ? category : "All", q }),
    listArticles({ type: "encyclopedia", category: isEncyclopedia ? category : "All", q }),
  ])

  // Filter encyclopedia to F1 Racers, F1 Teams, F1 Cars (keeping F1 focus clean)
  const f1EncycloPosts = encycloPosts.filter((e) =>
    ["F1 Racers", "F1 Teams", "F1 Cars", "F1 Encyclopedia"].includes(e.category)
  )

  const featuredNews = newsPosts[0]
  const remainingNews = newsPosts.slice(1)

  return (
    <div
      className="py-10 min-h-[75vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
    >
      <div className="content-container space-y-8">
        {/* Unified Blog + F1 Encyclopedia Hero Header */}
        <div className="rounded-2xl bg-[#0D0D10] text-white p-7 sm:p-10 border-b-4 border-[var(--imotora-red)] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span
                className="inline-block px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-[0.22em] text-white"
                style={{ backgroundColor: "var(--imotora-red)" }}
              >
                iMotora Paddock Journal
              </span>
              <h1 className="font-racing text-3xl sm:text-5xl font-black leading-tight">
                {isEncyclopedia ? (
                  <>
                    Formula 1{" "}
                    <span style={{ color: "var(--imotora-red)" }}>Encyclopedia</span>
                  </>
                ) : (
                  <>
                    iMotora{" "}
                    <span style={{ color: "var(--imotora-red)" }}>Blog</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-zinc-300">
                {isEncyclopedia
                  ? "Explore legendary Formula 1 racers, historic teams, and championship-winning F1 cars."
                  : "Latest Formula 1 news, race insights, livery spotlights, and our integrated F1 Encyclopedia."}
              </p>
            </div>

            <LocalizedClientLink
              href="/community"
              className="imotora-btn-primary px-5 py-2.5 text-xs self-start lg:self-end"
            >
              Join Collector Forum →
            </LocalizedClientLink>
          </div>

          {/* Primary Switcher Tabs inside Blog: Latest F1 News | F1 Encyclopedia */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
            <LocalizedClientLink
              href="/blog?tab=news"
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
                !isEncyclopedia
                  ? "text-white shadow-lg"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"
              }`}
              style={!isEncyclopedia ? { backgroundColor: "var(--imotora-red)" } : undefined}
            >
              Latest F1 News ({newsPosts.length})
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/blog?tab=encyclopedia"
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
                isEncyclopedia
                  ? "text-white shadow-lg"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"
              }`}
              style={isEncyclopedia ? { backgroundColor: "var(--imotora-red)" } : undefined}
            >
              F1 Encyclopedia: Racers, Teams &amp; Cars ({f1EncycloPosts.length})
            </LocalizedClientLink>
          </div>
        </div>

        {/* Sub-Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(isEncyclopedia ? ENCYCLO_CATEGORIES : NEWS_CATEGORIES).map((cat) => {
            const active = category === cat
            const href =
              cat === "All"
                ? `/blog?tab=${isEncyclopedia ? "encyclopedia" : "news"}`
                : `/blog?tab=${isEncyclopedia ? "encyclopedia" : "news"}&category=${encodeURIComponent(cat)}`
            return (
              <LocalizedClientLink
                key={cat}
                href={href}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                  active
                    ? "text-white border-transparent shadow"
                    : "bg-white text-zinc-800 border-zinc-300 hover:border-[var(--imotora-red)]"
                }`}
                style={active ? { backgroundColor: "var(--imotora-red)" } : undefined}
              >
                {cat}
              </LocalizedClientLink>
            )
          })}
        </div>

        {/* TAB 1: LATEST F1 NEWS */}
        {!isEncyclopedia && (
          <div className="space-y-8">
            {featuredNews && (
              <LocalizedClientLink
                href={`/blog/${featuredNews.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 hover:border-[var(--imotora-red)] shadow-lg transition-all"
              >
                <div className="lg:col-span-7 relative min-h-[260px] bg-[#0D0D10] overflow-hidden">
                  <img
                    src={featuredNews.cover_image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wider text-white shadow"
                    style={{ backgroundColor: "var(--imotora-red)" }}
                  >
                    {featuredNews.category}
                  </span>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Featured Story &bull; {featuredNews.read_time}
                    </p>
                    <h2 className="font-racing text-2xl sm:text-3xl font-black text-[#0D0D10] group-hover:text-[var(--imotora-red)] transition-colors leading-tight">
                      {featuredNews.title}
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed">{featuredNews.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs">
                    <span className="font-bold text-zinc-800">{featuredNews.author}</span>
                    <span className="font-extrabold" style={{ color: "var(--imotora-red)" }}>
                      Read Article →
                    </span>
                  </div>
                </div>
              </LocalizedClientLink>
            )}

            {remainingNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {remainingNews.map((post) => (
                  <LocalizedClientLink
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white text-zinc-900 rounded-xl overflow-hidden border border-zinc-200 hover:border-[var(--imotora-red)] shadow-md hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative h-48 bg-[#0D0D10] overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#0D0D10]/90 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-zinc-500">{post.read_time}</p>
                        <h3 className="font-bold text-base text-[#0D0D10] group-hover:text-[var(--imotora-red)] transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
                        <span className="font-semibold text-zinc-700 truncate">{post.author}</span>
                        <span
                          className="font-extrabold shrink-0"
                          style={{ color: "var(--imotora-red)" }}
                        >
                          Read →
                        </span>
                      </div>
                    </div>
                  </LocalizedClientLink>
                ))}
              </div>
            )}

            {/* Quick Callout to F1 Encyclopedia right inside Blog */}
            <div className="rounded-2xl bg-[#0D0D10] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-[var(--imotora-red)]">
              <div>
                <p
                  className="text-[11px] font-extrabold uppercase tracking-[0.2em]"
                  style={{ color: "var(--imotora-red)" }}
                >
                  Inside the Blog
                </p>
                <h3 className="font-racing text-2xl font-black mt-0.5">
                  Explore the Formula 1 Encyclopedia
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  Dive into profiles of iconic F1 racers, legendary constructors, and record-breaking
                  championship cars.
                </p>
              </div>
              <LocalizedClientLink
                href="/blog?tab=encyclopedia"
                className="imotora-btn-primary px-5 py-2.5 text-xs shrink-0"
              >
                Open F1 Encyclopedia →
              </LocalizedClientLink>
            </div>
          </div>
        )}

        {/* TAB 2: INTEGRATED F1 ENCYCLOPEDIA (RACERS, TEAMS, CARS) */}
        {isEncyclopedia && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {f1EncycloPosts.map((entry) => {
              const specs =
                entry.specs_json && typeof entry.specs_json === "object"
                  ? Object.entries(entry.specs_json).slice(0, 4)
                  : []
              return (
                <LocalizedClientLink
                  key={entry.id}
                  href={`/blog/${entry.slug}`}
                  className="group bg-white text-zinc-900 rounded-xl overflow-hidden border border-zinc-200 hover:border-[var(--imotora-red)] shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-[#0D0D10] overflow-hidden">
                      <img
                        src={entry.cover_image}
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-white text-[10px] font-extrabold uppercase tracking-wider shadow"
                        style={{ backgroundColor: "var(--imotora-red)" }}
                      >
                        {entry.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h2 className="font-racing text-xl font-black text-[#0D0D10] group-hover:text-[var(--imotora-red)] transition-colors leading-snug">
                        {entry.title}
                      </h2>
                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                        {entry.excerpt}
                      </p>
                      {specs.length > 0 && (
                        <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 space-y-1.5 text-[11px]">
                          {specs.map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2">
                              <span className="text-zinc-500">{k}</span>
                              <span className="font-bold text-zinc-900 text-right">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs font-extrabold">
                    <span className="text-zinc-600">{entry.read_time}</span>
                    <span style={{ color: "var(--imotora-red)" }}>Open Dossier →</span>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

