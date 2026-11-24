import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OriginalsBanner() {
  return (
    <section className="w-full relative overflow-hidden bg-[#0D0D10] border-y-4 border-[var(--imotora-red)]">
      <div className="relative min-h-[300px] sm:min-h-[350px] flex items-center">
        <img
          src="/images/originals-porsche.jpg"
          alt="iMotora Originals Porsche 911 GT3 RS"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-[#0D0D10]/75 to-[#0D0D10]/95" />

        <div className="relative z-10 content-container py-12 flex justify-end">
          <div className="max-w-lg text-left sm:text-right flex flex-col sm:items-end">
            <span
              className="font-racing text-lg sm:text-xl font-bold tracking-wide"
              style={{ color: "var(--imotora-red)" }}
            >
              iMotora Originals
            </span>
            <h2 className="font-racing text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-1 leading-tight">
              Exclusive. Unique. Yours.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-300 max-w-md">
              Specially curated limited-run die-cast drops &amp; pre-order exclusives for true
              automotive enthusiasts.
            </p>
            <div className="mt-6">
              <LocalizedClientLink
                href="/collections/imotora-originals"
                className="imotora-btn-primary px-6 py-2.5 text-sm shadow-lg"
              >
                Discover Originals <span aria-hidden="true">→</span>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
