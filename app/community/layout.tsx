import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./components/providers"
import GlobalHeader from "./components/global-header"

export const metadata: Metadata = {
  title: "Community - Caregene AI",
  description: "Connect with other families and caregivers in our supportive community platform",
  generator: 'v0.dev'
}

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <GlobalHeader>
        {children}
      </GlobalHeader>
    </Providers>
  )
}
