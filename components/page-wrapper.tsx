"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { GlobalHeader } from "@/components/global-header"
import { useNavigation } from "@/components/navigation-context"
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  selectedChildId?: string
  onChildSelect?: (childId: string) => void
  showChildSelector?: boolean
}

export function PageWrapper({ children, selectedChildId, onChildSelect, showChildSelector = false }: PageWrapperProps) {
  const { isPinned } = useNavigation()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalHeader
        selectedChildId={selectedChildId}
        onChildSelect={onChildSelect}
        showChildSelector={showChildSelector}
      />
      <main
        className={cn(
          "pt-14 transition-all duration-300 ease-in-out",
          "px-2 sm:px-4 md:px-6",
          // Desktop navigation spacing
          isPinned ? "lg:pl-[13rem] xl:pl-[15rem]" : "lg:pl-[3.5rem]",
          // Mobile and tablet - no left padding since nav is overlay
          "pl-2 sm:pl-4 md:pl-6 lg:pl-[3.5rem]",
        )}
      >
        {children}
      </main>
    </div>
  )
}

export default PageWrapper
