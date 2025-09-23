"use client"

import React, { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = { children: React.ReactNode }

export default function GlobalHeader({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const activeTab = useMemo(() => {
    const p = pathname || "/community"
    if (p.startsWith("/community/community")) return "groups"
    if (p.startsWith("/community/experts")) return "experts"
    if (p.startsWith("/community/events")) return "events"
    if (p.startsWith("/community/resources")) return "resources"
    if (p.startsWith("/community/insights")) return "insights"
    return "community"
  }, [pathname])

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Care Community</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Connect with families facing similar genetic health journeys
              </p>
            </div>
          </div>
        </div>

      <main className="px-4 py-6 max-w-7xl mx-auto">
          <Tabs value={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
              <TabsTrigger
                value="community"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community") }}
              >
                Community
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community/community") }}
              >
                Support Groups
              </TabsTrigger>
              <TabsTrigger
                value="experts"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community/experts") }}
              >
                Expert Connect
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community/events") }}
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community/resources") }}
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="text-xs sm:text-sm"
                onClick={(e) => { e.preventDefault(); router.push("/community/insights") }}
              >
                Insights
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-20 sm:mt-8">
            {children}
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}
