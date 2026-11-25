"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <>
      {/* Compact horizontal pill bar on mobile */}
      <div className="small:hidden flex flex-col gap-2" data-testid={dataTestId}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Sort by
        </span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((item) => {
            const active = sortBy === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleChange(item.value as SortOptions)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-[#0D0D10] text-white border-[#0D0D10]"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sidebar radio list on desktop */}
      <div className="hidden small:block">
        <FilterRadioGroup
          title="Sort by"
          items={sortOptions}
          value={sortBy}
          handleChange={handleChange}
          data-testid={dataTestId}
        />
      </div>
    </>
  )
}

export default SortProducts
