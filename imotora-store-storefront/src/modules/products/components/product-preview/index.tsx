import { HttpTypes } from "@medusajs/types"
import ImotoraProductCard from "../imotora-product-card"

export default async function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  return <ImotoraProductCard product={product} />
}
