"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { generateMilestoneBreadcrumbs } from "@/lib/milestone-utils"

interface MilestoneBreadcrumbsProps {
  childId?: string
  ageKey?: string
  currentPage?: string
}

export function MilestoneBreadcrumbs({ childId, ageKey, currentPage }: MilestoneBreadcrumbsProps) {
  const breadcrumbs = generateMilestoneBreadcrumbs(childId, ageKey, currentPage)

  return (
    null
  )
}
