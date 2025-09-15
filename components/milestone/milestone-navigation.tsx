"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CheckSquare, Lightbulb, Calendar, FileText } from "lucide-react"
import { getChildName, childExists } from "@/lib/milestone-utils"

interface MilestoneNavigationProps {
  childId?: string
  ageKey?: string
}

export function MilestoneNavigation({ childId, ageKey }: MilestoneNavigationProps) {
  const pathname = usePathname()

  // Base navigation items (always available)
  const baseNavItems: any[] = []

  // Child-specific navigation items (only available when childId is valid)
  const childSpecificNavItems =
    childId && childExists(childId)
      ? [
          {
            href: `/milestone/checklist/${childId}/${ageKey || "current"}`,
            label: "Checklist",
            icon: CheckSquare,
          },
          {
            href: `/milestone/tips/${childId}/${ageKey || "current"}`,
            label: "Tips & Activities",
            icon: Lightbulb,
          },
          {
            href: `/milestone/appointments/${childId}`,
            label: "Appointments",
            icon: Calendar,
          },
          {
            href: `/milestone/summary/${childId}`,
            label: "Summary",
            icon: FileText,
          },
        ]
      : []

  // Combine navigation items (removed settingsNavItems)
  const navItems = [...baseNavItems, ...childSpecificNavItems]

  return (
    null
  )
}
