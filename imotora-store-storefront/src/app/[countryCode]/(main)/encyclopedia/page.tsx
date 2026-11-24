import { redirect } from "next/navigation"

export default async function EncyclopediaRedirect(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  redirect(`/${countryCode}/blog?tab=encyclopedia`)
}
