import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
      className="flex-1 py-10 min-h-[75vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)" }}
      data-testid="account-page"
    >
      <div className="content-container max-w-5xl mx-auto">
        {customer ? (
          <div className="bg-white text-zinc-900 rounded-2xl px-6 sm:px-10 shadow-xl border border-zinc-200 flex flex-col">
            <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-10 gap-8">
              <div>
                <AccountNav customer={customer} />
              </div>
              <div className="flex-1">{children}</div>
            </div>
            <div className="flex flex-col small:flex-row items-start small:items-end justify-between border-t border-zinc-200 py-8 gap-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Got questions?</h3>
                <span className="text-sm text-zinc-600">
                  Reach out to our iMotora Collector Support team for help with orders or pre-order drops.
                </span>
              </div>
              <div>
                <UnderlineLink href="/contact">Contact Support</UnderlineLink>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">{children}</div>
        )}
      </div>
    </div>
  )
}

export default AccountLayout
