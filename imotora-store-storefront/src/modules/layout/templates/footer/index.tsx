import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "@modules/layout/components/newsletter-form"

export default async function Footer() {
  return (
    <footer className="bg-white border-t-4 border-[var(--imotora-red)] text-zinc-700 w-full mt-12">
      <div className="content-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column — Clean Pure White behind the Official iMotora Logo */}
          <div className="space-y-3">
            <LocalizedClientLink href="/" className="inline-flex flex-col items-start">
              <img
                src="/images/imotora-logo.png"
                alt="iMotora"
                className="h-12 w-auto object-contain"
              />
              <span className="text-[9.5px] font-bold tracking-[0.22em] text-zinc-700 uppercase mt-1 pl-1">
                COLLECT &bull; RACE &bull; DISPLAY
              </span>
            </LocalizedClientLink>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[230px]">
              India&apos;s premier destination for authentic 1:64, 1:43, and 1:18 die-cast
              collectibles, racing tracks, and museum-grade displays.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0D0D10] mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-[var(--imotora-red)] transition-colors">
                  Shop
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/collections/supercars"
                  className="hover:text-[var(--imotora-red)] transition-colors"
                >
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/blog" className="hover:text-[var(--imotora-red)] transition-colors">
                  Blog &amp; F1 Encyclopedia
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/community" className="hover:text-[var(--imotora-red)] transition-colors">
                  Community Forum
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="hover:text-[var(--imotora-red)] transition-colors">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-[var(--imotora-red)] transition-colors">
                  Contact Us
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0D0D10] mb-4 uppercase tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
              <li>
                <LocalizedClientLink
                  href="/policies/shipping"
                  className="hover:text-[var(--imotora-red)] transition-colors"
                >
                  Shipping Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/policies/returns"
                  className="hover:text-[var(--imotora-red)] transition-colors"
                >
                  Return &amp; Refund
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/policies/privacy"
                  className="hover:text-[var(--imotora-red)] transition-colors"
                >
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/policies/terms"
                  className="hover:text-[var(--imotora-red)] transition-colors"
                >
                  Terms &amp; Conditions
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0D0D10] mb-4 uppercase tracking-wide">
              Stay Connected
            </h4>
            <div className="flex items-center gap-2.5 text-white">
              {[
                { name: "YouTube", href: "https://youtube.com", path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" },
                { name: "Instagram", href: "https://instagram.com", path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 01-1.4-.9c-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.3-.1 1.6-.1 4.9-.1M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4A6 6 0 00.6 4.1C.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.2 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.2 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.2-2.2-.6-3a6 6 0 00-1.4-2.2A6 6 0 0019.9.6c-.8-.3-1.7-.5-3-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z" },
                { name: "Facebook", href: "https://facebook.com", path: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full bg-[#0D0D10] hover:bg-[var(--imotora-red)] flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
            <NewsletterForm />
          </div>

          {/* Secure Payments */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0D0D10] mb-4 uppercase tracking-wide">
              Secure Payments
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#1A2456] text-white font-extrabold text-[11px] tracking-wider">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0D0D10] flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] -ml-1.5 inline-block opacity-90" />
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-900 font-extrabold text-[11px] tracking-wider border border-zinc-300">
                UPI
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-100 text-sky-700 font-extrabold text-[11px] tracking-tight border border-zinc-300">
                RuPay
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-3">
              256-bit SSL encrypted checkout. Insured pan-India delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Bold Jet Black with Lamborghini Red Accents */}
      <div className="bg-[#0D0D10] text-zinc-400">
        <div className="content-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} iMotora. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <p className="font-racing italic text-white text-sm tracking-wide">
              Dream. Collect. <span style={{ color: "var(--imotora-red)" }}>Drive.</span>
            </p>
            <div className="hidden sm:flex items-center gap-1 -skew-x-12">
              <span className="w-2 h-4" style={{ backgroundColor: "var(--imotora-red)" }} />
              <span className="w-1 h-4 bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
