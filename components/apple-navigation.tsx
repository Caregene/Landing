"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown, User, Settings, LogOut, UserCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Child {
  id: string
  name: string
  firstName: string
  age: number
  avatar: string
}

interface AppleNavigationProps {
  selectedChild: Child
  children: Child[]
  onChildSelect: (childId: string) => void
  onMenuClick?: () => void
}

export function AppleNavigation({ selectedChild, children, onChildSelect, onMenuClick }: AppleNavigationProps) {
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false)

  const handleChildSelect = (childId: string) => {
    onChildSelect(childId)
    setIsChildDropdownOpen(false)
  }

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
      </div>
    </nav>
  )
}
