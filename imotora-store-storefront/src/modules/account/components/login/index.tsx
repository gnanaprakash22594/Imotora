"use client"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full flex flex-col items-center" data-testid="login-page">
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2.5">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-5 h-10 font-bold text-white border-none"
          style={{ backgroundColor: "var(--imotora-red)" }}
        >
          Sign in with Email
        </SubmitButton>
      </form>
      <span className="text-center text-zinc-600 text-xs mt-5">
        New to iMotora?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-bold underline text-[#0D0D10] hover:text-[var(--imotora-red)]"
          data-testid="register-button"
        >
          Create Collector Account
        </button>
      </span>
    </div>
  )
}

export default Login
