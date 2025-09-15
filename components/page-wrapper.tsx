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
  const { isPinned } = useNavigation() // Get pinned state from navigation context

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
          "pt-4 transition-all duration-300 ease-in-out", // Reduced top padding from pt-16 to pt-4 to eliminate empty space
          isPinned
            ? "pl-[13rem] lg:pl-[14rem] xl:pl-[15rem]" // Use exact rem values that match navigation widths plus border
            : "pl-[3rem] lg:pl-[3.5rem]", // Match collapsed navigation widths plus border
          "pr-4 lg:pr-6", // Added right padding to prevent content from touching screen edge
        )}
      >
        {children}
      </main>
    </div>
  )
}

export default PageWrapper
