import { getBaseURL } from "@lib/util/env"
import { WishlistProvider } from "@lib/context/wishlist-context"
import { ThemeProvider } from "@lib/context/theme-context"
import ThemeExplorer from "@modules/layout/components/theme-explorer"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "iMotora | The World of Automotive Collectibles",
    template: "%s | iMotora",
  },
  description:
    "Discover premium 1:64, 1:43, and 1:18 die-cast cars, pre-orders, racing tracks, LED display cases, and collector accessories at iMotora. Collect • Race • Display.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-imotora-theme="rosso-split" data-mode="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,700;0,800;1,700;1,800;1,900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[var(--page-bg)] text-[var(--text-main)] font-sans antialiased selection:bg-[var(--imotora-red)] selection:text-white"
        style={
          {
            "--font-inter": "'Inter', sans-serif",
            "--font-display": "'Exo 2', sans-serif",
          } as React.CSSProperties
        }
      >
        <ThemeProvider>
          <WishlistProvider>
            <main className="relative min-h-screen">{props.children}</main>
            <ThemeExplorer />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
