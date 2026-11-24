"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import OtpLogin from "@modules/account/components/otp-login"
import GoogleAuthButton from "@modules/account/components/google-auth-button"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  OTP = "otp",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden">
        {/* Clean White Brand Header */}
        <div className="px-6 pt-7 pb-5 text-center border-b border-zinc-100">
          <img
            src="/images/imotora-logo.png"
            alt="iMotora"
            className="h-10 w-auto mx-auto object-contain"
          />
          <p className="text-[10px] font-bold tracking-[0.24em] text-zinc-500 uppercase mt-1.5">
            COLLECT &bull; RACE &bull; DISPLAY
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 border-b border-zinc-200 bg-zinc-50 text-xs font-extrabold">
          {[
            { id: LOGIN_VIEW.SIGN_IN, label: "Sign In" },
            { id: LOGIN_VIEW.OTP, label: "OTP Login" },
            { id: LOGIN_VIEW.REGISTER, label: "Register" },
          ].map((tab) => {
            const active = currentView === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentView(tab.id)}
                className={`py-3 transition-colors border-b-2 ${
                  active
                    ? "bg-white text-[#0D0D10] border-[var(--imotora-red)]"
                    : "text-zinc-500 border-transparent hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Google Sign-In Option */}
          <GoogleAuthButton
            label={
              currentView === LOGIN_VIEW.REGISTER
                ? "Sign up with Google"
                : "Continue with Google"
            }
          />

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-zinc-200" />
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              or
            </span>
            <div className="flex-1 border-t border-zinc-200" />
          </div>

          {currentView === LOGIN_VIEW.SIGN_IN && (
            <Login setCurrentView={setCurrentView} />
          )}
          {currentView === LOGIN_VIEW.OTP && <OtpLogin />}
          {currentView === LOGIN_VIEW.REGISTER && (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
