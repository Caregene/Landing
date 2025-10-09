"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Dna,
  Search,
  FileText,
  Users,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Building2,
  Settings,
  Stethoscope,
  FlaskConical,
  Clock,
  Plus,
  Pin,
  FolderOpen,
  BookOpen,
  Edit2,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/navigation-context"
import { RecentChatsSidebar } from "@/components/recent-chats-sidebar"
import { getAuthState, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

function UserProfileSection() {
  const router = useRouter()
  const [authState, setAuthState] = useState(() => getAuthState())

  useEffect(() => {
    // Update auth state when component mounts
    setAuthState(getAuthState())
  }, [])

  const handleLogout = () => {
    logout()
    setAuthState({ isAuthenticated: false, token: null, userInfo: null })
    router.push('/signin')
  }

  if (!authState.isAuthenticated || !authState.userInfo) {
    return (
      <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
        <Link
          href="/signin"
          className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
        >
          <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-300" />
          <span className="text-sm text-sidebar-foreground">Sign In</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
      <div className="px-2 mb-2">
        <div className="text-xs text-muted-foreground mb-1">Signed in as</div>
        <div className="text-sm text-sidebar-foreground font-medium">{authState.userInfo.name}</div>
        <div className="text-xs text-muted-foreground">{authState.userInfo.email}</div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 text-left"
      >
        <div className="h-4 w-4 flex-shrink-0">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <span className="text-sm text-sidebar-foreground">Logout</span>
      </button>
    </div>
  )
}

export function Navigation() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["parent", "enterprise"])
  const { isMobileMenuOpen, setIsMobileMenuOpen, isPinned, setIsPinned } = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [editingProject, setEditingProject] = useState<string | null>(null) // Added state for tracking which project is being edited
  const [editProjectName, setEditProjectName] = useState("") // Added state for editing project name
  const [isHovered, setIsHovered] = useState(false) // Added hover state for navigation expansion
  const navRef = useRef<HTMLElement>(null)

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    // TODO: Implement search with chat history service
    setSearchResults([])
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  const handleEditProject = (projectId: string, currentName: string) => {
    setEditingProject(projectId)
    setEditProjectName(currentName)
  }

  const handleSaveProjectName = (projectId: string) => {
    if (editProjectName.trim()) {
      const existingProjects = JSON.parse(localStorage.getItem("caregene-projects") || "[]")
      const updatedProjects = existingProjects.map((project: any) =>
        project.id === projectId ? { ...project, name: editProjectName.trim() } : project,
      )
      localStorage.setItem("caregene-projects", JSON.stringify(updatedProjects))
      setProjects(updatedProjects.slice(0, 5))
    }
    setEditingProject(null)
    setEditProjectName("")
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditProjectName("")
  }

  const handleDeleteProject = (projectId: string) => {
    const existingProjects = JSON.parse(localStorage.getItem("caregene-projects") || "[]")
    const updatedProjects = existingProjects.filter((project: any) => project.id !== projectId)
    localStorage.setItem("caregene-projects", JSON.stringify(updatedProjects))
    setProjects(updatedProjects.slice(0, 5))
  }

  const truncateProjectName = (name: string) => {
    const words = name.split(" ")
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : name
  }

  const projectTypes = [
    { value: "health-tracking", label: "Health Tracking" },
    { value: "milestone-monitoring", label: "Milestone Monitoring" },
    { value: "research-study", label: "Research Study" },
    { value: "clinical-trial", label: "Clinical Trial" },
    { value: "genetic-analysis", label: "Genetic Analysis" },
    { value: "therapy-tracking", label: "Therapy Tracking" },
    { value: "medication-management", label: "Medication Management" },
    { value: "general", label: "General Project" },
  ]

  const shouldExpand = isPinned || isHovered

  const parentApps = [
    { href: "/health-plan", icon: Stethoscope, label: "Health Journey" },
    { href: "/doc-hub", icon: FileText, label: "DocHub" },
    { href: "/condition-knowledge", icon: BookOpen, label: "Condition Knowledge" },
    { href: "/community", icon: Users, label: "Community" },
  ]

  const enterpriseApps = [{ href: "/research-platform", icon: FlaskConical, label: "Research Platform" }]

  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = JSON.parse(localStorage.getItem("caregene-projects") || "[]")
      setProjects(savedProjects.slice(0, 5))
    }

    loadProjects()

    const handleStorageChange = () => {
      loadProjects()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-[60] h-full bg-sidebar/95 backdrop-blur border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "hidden md:block",
          shouldExpand ? "w-52 lg:w-56 xl:w-60" : "w-12 md:w-14",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-sidebar-border flex items-center justify-between p-3">
            <Link href="/" className="flex items-center transition-all duration-200 space-x-2">
              <div className="flex-shrink-0 h-6 w-6">
                <Image
                  src="/images/caregene-logo.png"
                  alt="Caregene AI"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              {shouldExpand && (
                <span className="font-serif font-bold text-sm text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              )}
            </Link>

            {shouldExpand && (
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={cn(
                  "p-1 rounded-md hover:bg-sidebar-accent/10 transition-colors sm:block hidden",
                  isPinned ? "text-sidebar-primary" : "text-muted-foreground",
                )}
                title={isPinned ? "Unpin navigation" : "Pin navigation"}
              >
                <Pin className={cn("h-3 w-3 transition-transform", isPinned && "rotate-45")} />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {/* New Chat */}
            <Link
              href="/"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
            >
              <Plus className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              {shouldExpand && <span className="text-sm text-sidebar-foreground">New Chat</span>}
            </Link>

            {shouldExpand ? (
              <div className="my-2">
                <div className="relative">
                  <div className="flex items-center rounded-lg border border-sidebar-border bg-sidebar-accent/5 h-8 px-2">
                    <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-sidebar-foreground placeholder:text-muted-foreground border-0 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="ml-1 p-0.5 hover:bg-sidebar-accent/20 rounded">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {isSearching && (
                  <div className="mt-1 max-h-40 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-0.5">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/chat/${result.id}`}
                            className="block p-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
                          >
                            <div className="text-xs font-medium text-sidebar-foreground truncate">{result.title}</div>
                            <div className="text-xs text-muted-foreground truncate mt-1">{result.content}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-xs text-muted-foreground text-center">No chats found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/search"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              >
                <Search className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              </Link>
            )}

            {/* Projects */}
            {shouldExpand && projects.length > 0 && (
              <div className="ml-6 mt-1 space-y-0.5">
                {projects.map((project) => (
                  <div key={project.id} className="group">
                    {editingProject === project.id ? (
                      <div className="flex items-center space-x-2 px-2 py-1">
                        <input
                          type="text"
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveProjectName(project.id)
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                          className="flex-1 text-xs bg-sidebar-accent/20 border border-sidebar-border rounded px-1 py-0.5 text-sidebar-foreground"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveProjectName(project.id)}
                          className="p-0.5 hover:bg-sidebar-accent/20 rounded text-green-600"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-0.5 hover:bg-sidebar-accent/20 rounded text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground group">
                        <Link href={`/?project=${project.id}`} className="flex items-center space-x-2 flex-1 min-w-0">
                          <FolderOpen className="h-3 w-3 flex-shrink-0 text-sidebar-primary opacity-60 group-hover:opacity-100" />
                          <span className="truncate">{truncateProjectName(project.name)}</span>
                        </Link>
                        <button
                          onClick={() => handleEditProject(project.id, project.name)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent/20 rounded transition-opacity"
                          title="Edit project name"
                        >
                          <Edit2 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent/20 rounded transition-opacity"
                          title="Delete project"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recent Chats */}
            {shouldExpand && (
              <RecentChatsSidebar 
                className="border-b border-sidebar-border/50 mb-2 pb-2"
                onChatSelect={(sessionId) => {
                  // Navigate to search with session context
                  window.location.href = `/search?session_id=${sessionId}`;
                }}
              />
            )}

            {!shouldExpand && (
              <Link
                href="/search"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 mb-2"
                title="Recent Chats"
              >
                <Clock className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              </Link>
            )}

            {/* Parent Apps Section */}
            <div>
              <button
                onClick={() => toggleSection("parent")}
                className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2"
              >
                <div className="flex items-center space-x-2">
                  <Dna className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {shouldExpand && <span className="text-sm font-medium text-sidebar-foreground">Care Hub</span>}
                </div>
                {shouldExpand && (
                  <>
                    {expandedSections.includes("parent") ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {shouldExpand && expandedSections.includes("parent") && (
                <div className="ml-6 mt-1">
                  {parentApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground"
                    >
                      <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Enterprise/Science Section */}
            <div className="mt-1">
              <button
                onClick={() => toggleSection("enterprise")}
                className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2"
              >
                <div className="flex items-center space-x-2">
                  <FlaskConical className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {shouldExpand && <span className="text-sm font-medium text-sidebar-foreground">Research</span>}
                </div>
                {shouldExpand && (
                  <>
                    {expandedSections.includes("enterprise") ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {shouldExpand && expandedSections.includes("enterprise") && (
                <div className="ml-6 mt-1">
                  {enterpriseApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground"
                    >
                      <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-2 pb-2 border-t border-sidebar-border">
            <div className="py-2">
              <Link
                href="/subscriptions"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              >
                <CreditCard className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && <span className="text-sm text-sidebar-foreground">Care Plans</span>}
              </Link>

              <Link
                href="/business"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              >
                <Building2 className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && <span className="text-sm text-sidebar-foreground">For Healthcare</span>}
              </Link>

              <Link
                href="/contact"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              >
                <Users className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && <span className="text-sm text-sidebar-foreground">Contact Us</span>}
              </Link>

              <Link
                href="/settings"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              >
                <Settings className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && <span className="text-sm text-sidebar-foreground">Settings & Help</span>}
              </Link>

              {shouldExpand && (
                <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
                  <div className="px-2 text-xs text-muted-foreground text-center">© 2025 Caregene AI</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-[68] h-full w-80 max-w-[85vw] bg-sidebar/98 backdrop-blur border-r border-sidebar-border md:hidden overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-sidebar-border flex items-center justify-between p-2.5">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center transition-all duration-200 space-x-2"
              >
                <div className="flex-shrink-0 h-6 w-6">
                  <Image
                    src="/images/caregene-logo.png"
                    alt="Caregene AI"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-base text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {/* New Chat */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 touch-manipulation"
              >
                <Plus className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground">New Chat</span>
              </Link>

              {/* Search */}
              <div className="my-2">
                <div className="relative">
                  <div className="flex items-center rounded-lg border border-sidebar-border bg-sidebar-accent/5 h-8 px-2">
                    <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-sidebar-foreground placeholder:text-muted-foreground border-0 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="ml-1 p-0.5 hover:bg-sidebar-accent/20 rounded">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Search Results */}
                {isSearching && (
                  <div className="mt-1 max-h-40 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-0.5">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/chat/${result.id}`}
                            onClick={closeMobileMenu}
                            className="block p-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
                          >
                            <div className="text-xs font-medium text-sidebar-foreground truncate">{result.title}</div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">{result.content}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-xs text-muted-foreground text-center">No chats found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Projects - Mobile */}
              {projects.length > 0 && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {projects.map((project) => (
                    <div key={project.id} className="group">
                      {editingProject === project.id ? (
                        <div className="flex items-center space-x-1 px-2 py-1">
                          <input
                            type="text"
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveProjectName(project.id)
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                            className="flex-1 text-xs bg-sidebar-accent/20 border border-sidebar-border rounded px-1.5 py-0.5 text-sidebar-foreground"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveProjectName(project.id)}
                            className="p-0.5 hover:bg-sidebar-accent/20 rounded text-green-600"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-0.5 hover:bg-sidebar-accent/20 rounded text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs text-muted-foreground hover:text-foreground group">
                          <Link
                            href={`/?project=${project.id}`}
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-2 flex-1 min-w-0"
                          >
                            <FolderOpen className="h-3 w-3 flex-shrink-0 text-sidebar-primary opacity-60 group-hover:opacity-100" />
                            <div className="flex-1 min-w-0">
                              <span className="truncate block">{truncateProjectName(project.name)}</span>
                              {project.type !== "general" && (
                                <span className="text-[10px] text-muted-foreground/60">
                                  {projectTypes.find((t) => t.value === project.type)?.label || project.type}
                                </span>
                              )}
                            </div>
                          </Link>
                          <button
                            onClick={() => handleEditProject(project.id, project.name)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent/20 rounded transition-opacity"
                            title="Edit project name"
                          >
                            <Edit2 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent/20 rounded transition-opacity"
                            title="Delete project"
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Chats */}
              <Link
                href="/recent"
                onClick={closeMobileMenu}
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 mb-2"
              >
                <Clock className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground">Recent Chats</span>
              </Link>

              <div className="border-t border-sidebar-border/50 mb-2" />

              {/* Parent Apps Section */}
              <div>
                <button
                  onClick={() => toggleSection("parent")}
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2 touch-manipulation"
                >
                  <div className="flex items-center space-x-2">
                    <Dna className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-sm font-medium text-sidebar-foreground">Care Hub</span>
                  </div>
                  {expandedSections.includes("parent") ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.includes("parent") && (
                  <div className="ml-6 mt-0.5">
                    {parentApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs text-foreground hover:text-muted-foreground touch-manipulation"
                      >
                        <app.icon className="h-3.5 w-3.5 flex-shrink-0 text-sidebar-primary" />
                        <span>{app.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Enterprise/Science Section */}
              <div className="mt-0.5">
                <button
                  onClick={() => toggleSection("enterprise")}
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2 touch-manipulation"
                >
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-sm font-medium text-sidebar-foreground">Research</span>
                  </div>
                  {expandedSections.includes("enterprise") ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.includes("enterprise") && (
                  <div className="ml-6 mt-0.5">
                    {enterpriseApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs text-foreground hover:text-muted-foreground touch-manipulation"
                      >
                        <app.icon className="h-3.5 w-3.5 flex-shrink-0 text-sidebar-primary" />
                        <span>{app.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-2 pb-3 border-t border-sidebar-border">
              <div className="py-2">
                <Link
                  href="/subscriptions"
                  onClick={closeMobileMenu}
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                >
                  <CreditCard className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm text-sidebar-foreground">Care Plans</span>
                </Link>

                <Link
                  href="/business"
                  onClick={closeMobileMenu}
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                >
                  <Building2 className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm text-sidebar-foreground">For Healthcare</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                >
                  <Users className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm text-sidebar-foreground">Contact Us</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                >
                  <Settings className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm text-sidebar-foreground">Settings & Help</span>
                </Link>

                {/* User Profile & Logout Section */}
                <UserProfileSection />

                <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
                  <div className="px-2 text-[10px] text-muted-foreground">© 2025 Caregene AI</div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navigation
