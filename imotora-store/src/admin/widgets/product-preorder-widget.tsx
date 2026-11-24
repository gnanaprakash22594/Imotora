import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Button, Container, Heading, Input, Label, Switch, Text, Badge } from "@medusajs/ui"
import { useState } from "react"

const ProductPreorderWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const existingMeta = (product.metadata || {}) as Record<string, any>

  const [isPreorder, setIsPreorder] = useState<boolean>(
    Boolean(existingMeta.is_preorder)
  )
  const [releaseDate, setReleaseDate] = useState<string>(
    String(existingMeta.preorder_release_date || "")
  )
  const [depositPercent, setDepositPercent] = useState<string>(
    String(existingMeta.preorder_deposit_percent || "50")
  )
  const [preorderNote, setPreorderNote] = useState<string>(
    String(
      existingMeta.preorder_note ||
        "Reserve with 50% deposit today. Remaining 50% due before dispatch."
    )
  )
  const [preorderLimit, setPreorderLimit] = useState<string>(
    existingMeta.preorder_limit ? String(existingMeta.preorder_limit) : ""
  )
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  )

  const handleSave = async () => {
    setSaving(true)
    setStatusMsg(null)
    try {
      const updatedMetadata: Record<string, any> = {
        ...existingMeta,
        is_preorder: isPreorder,
        preorder_deposit_percent: isPreorder ? Number(depositPercent) || 50 : 100,
        preorder_release_date: isPreorder ? releaseDate || "Coming Soon" : "",
        preorder_note: isPreorder ? preorderNote : "",
        preorder_limit: isPreorder && preorderLimit ? Number(preorderLimit) : null,
      }

      const res = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: updatedMetadata,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `Failed (${res.status})`)
      }

      setStatusMsg({
        type: "ok",
        text: isPreorder
          ? "Pre-Order enabled! Storefront now shows Pre-Order badge & release date."
          : "Pre-Order disabled. Product switched to standard ordering.",
      })
    } catch (e: any) {
      setStatusMsg({ type: "err", text: e?.message || "Failed to save pre-order settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Pre-Order Settings</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Control pre-order availability on the iMotora storefront
          </Text>
        </div>
        {isPreorder ? (
          <Badge color="red">PRE-ORDER ACTIVE</Badge>
        ) : (
          <Badge color="grey">Standard Stock</Badge>
        )}
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="preorder-toggle" className="font-medium">
              Enable Pre-Order
            </Label>
            <Text size="xsmall" className="text-ui-fg-subtle">
              Shows &ldquo;Pre-Order Now&rdquo; button &amp; badge on storefront
            </Text>
          </div>
          <Switch
            id="preorder-toggle"
            checked={isPreorder}
            onCheckedChange={setIsPreorder}
          />
        </div>

        {isPreorder && (
          <div className="space-y-3 pt-2 border-t border-ui-border-base">
            <div>
              <Label htmlFor="preorder-deposit" size="small">
                Pre-Order Deposit Percentage (%)
              </Label>
              <Input
                id="preorder-deposit"
                type="number"
                min={10}
                max={100}
                value={depositPercent}
                onChange={(e) => setDepositPercent(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preorder-date" size="small">
                Expected Release / Dispatch Date
              </Label>
              <Input
                id="preorder-date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preorder-limit" size="small">
                Pre-Order Allocation Limit (optional)
              </Label>
              <Input
                id="preorder-limit"
                type="number"
                min={1}
                placeholder="e.g. 50"
                value={preorderLimit}
                onChange={(e) => setPreorderLimit(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preorder-note" size="small">
                Collector Note (shown on product page)
              </Label>
              <Input
                id="preorder-note"
                type="text"
                value={preorderNote}
                onChange={(e) => setPreorderNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {statusMsg && (
          <Text
            size="small"
            className={
              statusMsg.type === "ok" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"
            }
          >
            {statusMsg.text}
          </Text>
        )}

        <Button
          variant="primary"
          size="small"
          onClick={handleSave}
          isLoading={saving}
          className="w-full"
        >
          Save Pre-Order Settings
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductPreorderWidget

