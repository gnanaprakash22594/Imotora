import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const sortedItems = items
    ? [...items].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      )
    : null

  return (
    <div className="w-full min-w-0">
      <div className="pb-3 flex items-center">
        <Heading className="text-2xl sm:text-[2rem] leading-tight sm:leading-[2.75rem]">
          Cart
        </Heading>
      </div>

      {/* Mobile stacked item cards (zero horizontal overflow) */}
      <div className="block small:hidden divide-y divide-zinc-200">
        {sortedItems
          ? sortedItems.map((item) => (
              <Item
                key={item.id}
                item={item}
                currencyCode={cart?.currency_code ?? "inr"}
                layout="card"
              />
            ))
          : repeat(3).map((i) => (
              <div key={i} className="py-4 animate-pulse flex gap-3">
                <div className="w-20 h-20 rounded-lg bg-zinc-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            ))}
      </div>

      {/* Desktop table */}
      <div className="hidden small:block overflow-x-auto">
        <Table>
          <Table.Header className="border-t-0">
            <Table.Row className="text-ui-fg-subtle txt-medium-plus">
              <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell className="hidden small:table-cell">
                Price
              </Table.HeaderCell>
              <Table.HeaderCell className="!pr-0 text-right">
                Total
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedItems
              ? sortedItems.map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code ?? "inr"}
                    />
                  )
                })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate
