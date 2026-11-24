import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Label, Switch, Text, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

type SimpleProduct = {
  id: string
  title: string
  handle: string
  metadata?: Record<string, any>
}

const ProductListPreorderWidget = () => {
  const [openCreate, setOpenCreate] = useState(false)
  const [preorderProducts, setPreorderProducts] = useState<SimpleProduct[]>([])
  const [title, setTitle] = useState("")
  const [priceInr, setPriceInr] = useState("2499")
  const [scale, setScale] = useState("1:64 Scale")
  const [isPreorder, setIsPreorder] = useState(true)
  const [releaseDate, setReleaseDate] = useState("2026-12-20")
  const [note, setNote] = useState(
    "Reserve your numbered collector edition today. Ships immediately on arrival."
  )
  const [creating, setCreating] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const loadPreorderProducts = async () => {
    try {
      const res = await fetch("/admin/products?limit=50&fields=id,title,handle,metadata", {
        credentials: "include",
      })
      if (!res.ok) return
      const json = await res.json()
      const list = (json.products || []).filter((p: any) => Boolean(p?.metadata?.is_preorder))
      setPreorderProducts(list)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadPreorderProducts()
  }, [])

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    setFeedback(null)

    try {
      // Fetch default sales channel and shipping profile so product is immediately live
      const [scRes, spRes] = await Promise.all([
        fetch("/admin/sales-channels?limit=1", { credentials: "include" }),
        fetch("/admin/shipping-profiles?limit=1", { credentials: "include" }),
      ])
      const scJson = await scRes.json().catch(() => ({}))
      const spJson = await spRes.json().catch(() => ({}))
      const salesChannelId = scJson?.sales_channels?.[0]?.id
      const shippingProfileId = spJson?.shipping_profiles?.[0]?.id

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const body: Record<string, any> = {
        title: title.trim(),
        handle: `${slug}-${Date.now().toString().slice(-4)}`,
        status: "published",
        description: `${title.trim()} — authentic die-cast collectible from iMotora.`,
        thumbnail: "/images/prod-ferrari-sf90.jpg",
        images: [{ url: "/images/prod-ferrari-sf90.jpg" }],
        options: [{ title: "Scale", values: [scale || "1:64 Scale"] }],
        variants: [
          {
            title: scale || "1:64 Scale",
            sku: `IMT-PO-${Date.now().toString().slice(-6)}`,
            manage_inventory: false,
            allow_backorder: true,
            options: { Scale: scale || "1:64 Scale" },
            prices: [
              { amount: Number(priceInr) || 1999, currency_code: "inr" },
              { amount: Math.max(10, Math.round((Number(priceInr) || 1999) / 84)), currency_code: "usd" },
            ],
          },
        ],
        metadata: {
          scale: scale || "1:64",
          brand: "iMotora Originals",
          material: "Die-Cast Metal & ABS",
          is_preorder: isPreorder,
          preorder_deposit_percent: isPreorder ? 50 : 100,
          preorder_release_date: isPreorder ? releaseDate : "",
          preorder_note: isPreorder ? note : "",
        },
      }

      if (salesChannelId) {
        body.sales_channels = [{ id: salesChannelId }]
      }
      if (shippingProfileId) {
        body.shipping_profile_id = shippingProfileId
      }

      const res = await fetch("/admin/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Create failed (${res.status})`)
      }

      setTitle("")
      setFeedback({
        type: "ok",
        text: `Created "${title.trim()}" with Pre-Order ${isPreorder ? "ENABLED" : "disabled"}! Refresh table to view.`,
      })
      loadPreorderProducts()
    } catch (err: any) {
      setFeedback({ type: "err", text: err?.message || "Could not create product" })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Container className="p-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Heading level="h2">iMotora Pre-Order Manager</Heading>
          <Badge color="red">{preorderProducts.length} Active Pre-Orders</Badge>
        </div>
        <Button
          size="small"
          variant={openCreate ? "secondary" : "primary"}
          onClick={() => setOpenCreate((v) => !v)}
        >
          {openCreate ? "Close Form" : "+ Create Pre-Order Product"}
        </Button>
      </div>

      {preorderProducts.length > 0 && !openCreate && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {preorderProducts.map((p) => (
            <a
              key={p.id}
              href={`/app/products/${p.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-ui-border-base bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover text-xs font-medium"
            >
              <span>{p.title}</span>
              {p.metadata?.preorder_release_date && (
                <Badge size="2xsmall" color="red">
                  Ships {p.metadata.preorder_release_date}
                </Badge>
              )}
            </a>
          ))}
        </div>
      )}

      {openCreate && (
        <form
          onSubmit={handleCreateProduct}
          className="px-6 py-4 border-t border-ui-border-base bg-ui-bg-subtle space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="po-title" size="small">
                Product Title *
              </Label>
              <Input
                id="po-title"
                required
                placeholder="e.g. Lamborghini Revuelto 1:43 Rosso Mars"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="po-price" size="small">
                Price (INR ₹) *
              </Label>
              <Input
                id="po-price"
                type="number"
                required
                min={99}
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="po-scale" size="small">
                Scale Variant
              </Label>
              <Input
                id="po-scale"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-ui-border-base bg-ui-bg-base">
              <div>
                <Label htmlFor="po-enable" size="small">
                  Pre-Order Option
                </Label>
                <Text size="xsmall" className="text-ui-fg-subtle">
                  Mark as Pre-Order immediately
                </Text>
              </div>
              <Switch
                id="po-enable"
                checked={isPreorder}
                onCheckedChange={setIsPreorder}
              />
            </div>

            <div>
              <Label htmlFor="po-date" size="small">
                Expected Release Date
              </Label>
              <Input
                id="po-date"
                type="date"
                disabled={!isPreorder}
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="po-note" size="small">
                Pre-Order Note
              </Label>
              <Input
                id="po-note"
                disabled={!isPreorder}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {feedback && (
            <Text
              size="small"
              className={
                feedback.type === "ok"
                  ? "text-emerald-600 font-medium"
                  : "text-rose-600 font-medium"
              }
            >
              {feedback.text}
            </Text>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="small" onClick={() => setOpenCreate(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="small" isLoading={creating}>
              Create Product
            </Button>
          </div>
        </form>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default ProductListPreorderWidget

