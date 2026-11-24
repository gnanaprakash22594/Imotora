import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const metadata = (product.metadata || {}) as Record<string, any>
  const isPreorder = Boolean(metadata?.is_preorder)

  return (
    <div
      className="py-8 transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)" }}
    >
      {/* Breadcrumb */}
      <div className="content-container mb-5">
        <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <LocalizedClientLink href="/" className="hover:text-[var(--imotora-red)] transition-colors">
            Home
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store" className="hover:text-[var(--imotora-red)] transition-colors">
            Shop
          </LocalizedClientLink>
          <span>/</span>
          <span className="font-semibold truncate" style={{ color: "var(--text-main)" }}>
            {product.title}
          </span>
        </nav>
      </div>

      {/* Main Product Showcase */}
      <div className="content-container" data-testid="product-container">
        <div className="bg-white text-zinc-900 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xl border border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info & Collector Specs */}
          <div className="lg:col-span-3 flex flex-col gap-y-6 order-2 lg:order-1">
            {isPreorder && (
              <span className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D0D10] text-white text-[10px] font-extrabold uppercase tracking-wider">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--imotora-red)" }}
                />
                Pre-Order Exclusive
              </span>
            )}
            <ProductInfo product={product} />

            {(metadata.scale || metadata.brand || metadata.material) && (
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Collector Specs
                </h4>
                {metadata.scale && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Scale</span>
                    <span className="font-semibold text-zinc-900">{metadata.scale}</span>
                  </div>
                )}
                {metadata.brand && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Manufacturer</span>
                    <span className="font-semibold text-zinc-900">{metadata.brand}</span>
                  </div>
                )}
                {metadata.material && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Material</span>
                    <span className="font-semibold text-zinc-900">{metadata.material}</span>
                  </div>
                )}
              </div>
            )}

            <ProductTabs product={product} />
          </div>

          {/* Center: Product Gallery */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <ImageGallery images={images} />
          </div>

          {/* Right: Variant Selector & Add to Cart / Pre-Order */}
          <div className="lg:col-span-4 order-3 lg:sticky lg:top-28 bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-5">
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Free insured collector shipping above ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>100% authentic licensed die-cast models</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Bubble-wrapped mint-box collector packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div
        className="content-container my-14"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
