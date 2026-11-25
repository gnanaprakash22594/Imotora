import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
      <div className="min-w-0">
        <Heading level="h2" className="text-lg sm:text-2xl font-bold text-zinc-900">
          Already have an account?
        </Heading>
        <Text className="text-xs sm:text-sm text-zinc-500 mt-1">
          Sign in for a better experience.
        </Text>
      </div>
      <div className="shrink-0">
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-9 sm:h-10" data-testid="sign-in-button">
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
