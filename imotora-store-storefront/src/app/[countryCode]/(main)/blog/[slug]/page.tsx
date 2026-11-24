import { notFound } from "next/navigation"
import { getArticleBySlug } from "@lib/data/community"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const post = await getArticleBySlug(slug)
  if (!post) return notFound()

  const specs =
    post.specs_json && typeof post.specs_json === "object"
      ? Object.entries(post.specs_json)
      : []

  const backHref = post.type === "encyclopedia" ? "/blog?tab=encyclopedia" : "/blog?tab=news"
  const backLabel =
    post.type === "encyclopedia" ? "← Back to F1 Encyclopedia" : "← Back to Blog"

  return (
    <div
      className="py-10 min-h-[75vh]"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
    >
      <div className="content-container max-w-4xl space-y-6">
        <LocalizedClientLink
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold hover:text-[var(--imotora-red)] transition-colors"
        >
          {backLabel}
        </LocalizedClientLink>

        <article className="bg-white text-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 shadow-xl">
          <div className="relative h-[280px] sm:h-[380px] bg-[#0D0D10]">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--imotora-red)" }}
                >
                  {post.type === "encyclopedia" ? "F1 Encyclopedia" : "F1 News"}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/15 text-[10px] font-bold uppercase">
                  {post.category}
                </span>
              </div>
              <h1 className="font-racing text-2xl sm:text-4xl font-black leading-tight">
                {post.title}
              </h1>
              <p className="text-xs text-zinc-300">
                By <strong className="text-white">{post.author}</strong> &bull; {post.read_time}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {specs.length > 0 && (
              <div className="rounded-xl bg-[#0D0D10] text-white p-5 border-l-4 border-[var(--imotora-red)]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Key Formula 1 Specs &amp; Facts
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {specs.map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[11px] text-zinc-400">{k}</p>
                      <p className="text-sm font-extrabold text-white mt-0.5">{String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm sm:text-base text-zinc-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>

            {post.tags && (
              <div className="pt-5 border-t border-zinc-200 flex flex-wrap gap-2">
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <LocalizedClientLink href="/store" className="imotora-btn-primary px-5 py-2.5 text-xs">
                Shop Related Die-Cast Models →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/community"
                className="imotora-btn-black px-5 py-2.5 text-xs"
              >
                Discuss in Collector Forum →
              </LocalizedClientLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

