"use client"
import { Menu, X, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useNavigation } from "@/components/navigation-context"
import { usePathname } from "next/navigation"
import { ChildManagementDropdown } from "@/components/child-management-dropdown"

interface GlobalHeaderProps {
  selectedChildId?: string
  onChildSelect?: (childId: string) => void
  showChildSelector?: boolean
}

export function GlobalHeader({ selectedChildId, onChildSelect, showChildSelector = false }: GlobalHeaderProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen, isPinned } = useNavigation()
  const pathname = usePathname()

  const shouldShowChildSelector =
    showChildSelector && (pathname?.includes("/doc-hub") || pathname?.includes("/health-plan"))

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 z-[50] bg-white/95 backdrop-blur-sm",
          "left-0 lg:left-14",
          isPinned ? "lg:left-52 xl:left-60" : "lg:left-14",
        )}
      >
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 md:px-6">
          {/* Left side - hamburger menu (mobile) + child selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              )}
            </button>

            {shouldShowChildSelector && (
              <ChildManagementDropdown
                selectedChildId={selectedChildId}
                onChildSelect={onChildSelect}
                lastExperience={pathname || "/"}
              />
            )}
          </div>

          {/* Right side - profile avatar */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full p-0 hover:bg-gray-100 touch-manipulation"
                >
                  <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 z-[60]">
                <div className="px-3 py-2 border-b">
                  <div className="font-medium text-sm">John Doe</div>
                  <div className="text-xs text-gray-500">john.doe@example.com</div>
                </div>
                <DropdownMenuItem>My Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
          onClick={toggleMobileMenu}
          aria-label="Close navigation menu"
        />
      )}
    </>
  )
}
