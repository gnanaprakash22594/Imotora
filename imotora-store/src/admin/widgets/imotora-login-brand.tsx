import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"
import imotoraLogo from "../assets/imotora-logo.png"

const ImotoraLoginBrand = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "iMotora Admin — Sign In"
    return () => {
      document.title = prevTitle
    }
  }, [])

  return (
    <>
      <style>{`
        /* Full-screen dark automotive showroom backdrop on Login page */
        .min-h-dvh.w-dvw {
          background:
            radial-gradient(circle at 50% 0%, rgba(225, 29, 46, 0.24) 0%, rgba(11, 11, 14, 0) 55%),
            linear-gradient(180deg, #09090c 0%, #0d0d12 100%) !important;
        }

        /* Sleek dark collector card container */
        .min-h-dvh.w-dvw > div {
          max-width: 400px !important;
          padding: 36px 32px 30px !important;
          border-radius: 18px !important;
          background: #141418 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(225, 29, 46, 0.08) !important;
        }

        /* Hide the default Medusa hex icon box & default Welcome to Medusa heading */
        .min-h-dvh.w-dvw > div > div:nth-child(1),
        .min-h-dvh.w-dvw > div > div:nth-child(2) {
          display: none !important;
        }

        /* Dark-mode inputs with crisp focus ring */
        .min-h-dvh.w-dvw input {
          background-color: #1c1c24 !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: none !important;
        }

        .min-h-dvh.w-dvw input::placeholder {
          color: #71717a !important;
        }

        .min-h-dvh.w-dvw input:focus {
          border-color: #e11d2e !important;
          box-shadow: 0 0 0 2px rgba(225, 29, 46, 0.28) !important;
        }

        /* Eye toggle icon inside password input */
        .min-h-dvh.w-dvw input + div button,
        .min-h-dvh.w-dvw form button[type="button"] {
          color: #a1a1aa !important;
        }

        /* Racing Red primary login button */
        .min-h-dvh.w-dvw button[type="submit"] {
          background: #e11d2e !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          border: none !important;
          box-shadow: 0 8px 20px rgba(225, 29, 46, 0.3) !important;
          transition: background-color 150ms ease, transform 150ms ease !important;
        }

        .min-h-dvh.w-dvw button[type="submit"]:hover {
          background: #c81525 !important;
        }

        /* Forgot password text & link */
        .min-h-dvh.w-dvw > div > span,
        .min-h-dvh.w-dvw > div > p {
          color: #a1a1aa !important;
        }
        .min-h-dvh.w-dvw a {
          color: #f43f5e !important;
        }
        .min-h-dvh.w-dvw a:hover {
          color: #fb7185 !important;
        }
      `}</style>

      {/* Official iMotora Brand Header */}
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <img
          src={imotoraLogo}
          alt="iMotora"
          style={{ height: "56px", width: "auto", objectFit: "contain" }}
        />
        <span
          style={{
            marginTop: "6px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.26em",
            color: "#a1a1aa",
            textTransform: "uppercase",
          }}
        >
          COLLECT &bull; RACE &bull; DISPLAY
        </span>
        <div
          style={{
            marginTop: "14px",
            marginBottom: "14px",
            width: "48px",
            height: "2px",
            background: "#e11d2e",
            borderRadius: "9999px",
          }}
        />
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          iMotora Admin Portal
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#a1a1aa",
            marginTop: "4px",
          }}
        >
          Sign in to manage die-cast inventory, orders &amp; drops
        </p>
      </div>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default ImotoraLoginBrand
