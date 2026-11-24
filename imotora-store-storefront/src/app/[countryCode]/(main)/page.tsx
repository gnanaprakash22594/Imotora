import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import CategoryShowcase from "@modules/home/components/category-showcase"
import FeaturedShowcase from "@modules/home/components/featured-showcase"
import OriginalsBanner from "@modules/home/components/originals-banner"
import CollectionsShowcase from "@modules/home/components/collections-showcase"
import CommunityBanner from "@modules/home/components/community-banner"

export const metadata: Metadata = {
  title: "iMotora | The World of Automotive Collectibles",
  description:
    "Shop premium 1:64, 1:43, and 1:18 die-cast cars, pre-order exclusive drops, racing tracks, and display cases at iMotora. Free shipping above ₹999.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const featuredCollection = collections?.find((c) => c.handle === "featured")

  const [{ response: { products: featuredProducts } }, { response: { products: allProducts } }] =
    await Promise.all([
      listProducts({
        regionId: region.id,
        queryParams: {
          limit: 12,
          ...(featuredCollection ? { collection_id: [featuredCollection.id] } : {}),
        },
      }),
      listProducts({
        regionId: region.id,
        queryParams: { limit: 50 },
      }),
    ])

  const sortedFeatured = [...(featuredProducts || [])].sort((a, b) => {
    const rankA = Number((a.metadata as any)?.featured_rank ?? 99)
    const rankB = Number((b.metadata as any)?.featured_rank ?? 99)
    return rankA - rankB
  })

  const preorderProducts = (allProducts || []).filter(
    (p) => Boolean((p.metadata as any)?.is_preorder)
  )

  return (
    <div style={{ backgroundColor: "var(--page-bg)", color: "var(--text-main)" }}>
      <Hero />
      <CategoryShowcase />
      <FeaturedShowcase products={sortedFeatured} />
      <OriginalsBanner />
      {preorderProducts.length > 0 && (
        <FeaturedShowcase
          products={preorderProducts}
          titleFirst="Upcoming"
          titleAccent="Pre-Orders"
          viewAllHref="/store"
          viewAllLabel="Explore All Pre-Orders"
        />
      )}
      <CollectionsShowcase />
      <CommunityBanner />
    </div>
  )
}
