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
  Menu,
  X,
  FolderOpen,
  BookOpen,
  Edit2,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/navigation-context"
import { mockChatHistory } from "@/data/mockChatHistory"

export function Navigation() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["parent", "enterprise"])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [editingProject, setEditingProject] = useState<string | null>(null) // Added state for tracking which project is being edited
  const [editProjectName, setEditProjectName] = useState("") // Added state for editing project name
  const [isHovered, setIsHovered] = useState(false) // Added hover state for navigation expansion
  const { isPinned, setIsPinned } = useNavigation()
  const navRef = useRef<HTMLElement>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = mockChatHistory.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.content.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(results)
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

  const togglePin = () => {
    setIsPinned(!isPinned)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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
    { href: "/care-community", icon: Users, label: "Community" },
    { href: "/doc-hub", icon: FileText, label: "DocHub" },
    { href: "/condition-knowledge", icon: BookOpen, label: "Condition Knowledge" },
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
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-[70] p-2 rounded-lg bg-sidebar/95 backdrop-blur border border-sidebar-border lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        )}
      </button>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-[65] lg:hidden" onClick={closeMobileMenu} />}

      <nav
        ref={navRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-[60] h-full bg-sidebar/95 backdrop-blur border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "hidden lg:block",
          shouldExpand ? "w-52 lg:w-56 xl:w-60" : "w-12 lg:w-14",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-sidebar-border flex items-center justify-between p-3">
            <Link
              href="/"
              className="flex items-center transition-all duration-200 space-x-2"
              onClick={closeMobileMenu}
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
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="font-serif font-bold text-sm text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              )}
            </Link>

            {(shouldExpand || isMobileMenuOpen) && (
              <button
                onClick={togglePin}
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
              onClick={closeMobileMenu}
            >
              <Plus className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && <span className="text-sm text-sidebar-foreground">New Chat</span>}
            </Link>

            {shouldExpand || isMobileMenuOpen ? (
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
                            onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
              >
                <Search className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              </Link>
            )}

            {/* Projects */}
            {(shouldExpand || isMobileMenuOpen) && projects.length > 0 && (
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
                        <Link
                          href={`/?project=${project.id}`}
                          className="flex items-center space-x-2 flex-1 min-w-0"
                          onClick={closeMobileMenu}
                        >
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
            <Link
              href="/recent"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 mb-2"
              onClick={closeMobileMenu}
            >
              <Clock className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="text-sm text-sidebar-foreground">Recent Chats</span>
              )}
            </Link>

            {(shouldExpand || isMobileMenuOpen) && <div className="border-t border-sidebar-border/50 my-2" />}

            {/* Parent Apps Section */}
            <div>
              <button
                onClick={() => toggleSection("parent")}
                className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2"
              >
                <div className="flex items-center space-x-2">
                  <Dna className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-sm font-medium text-sidebar-foreground">Care Hub</span>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("parent") ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && expandedSections.includes("parent") && (
                <div className="ml-6 mt-1">
                  {parentApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground"
                      onClick={closeMobileMenu}
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
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-sm font-medium text-sidebar-foreground">Research</span>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("enterprise") ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && expandedSections.includes("enterprise") && (
                <div className="ml-6 mt-1">
                  {enterpriseApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground"
                      onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
              >
                <CreditCard className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Care Plans</span>
                )}
              </Link>

              <Link
                href="/business"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Building2 className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">For Healthcare</span>
                )}
              </Link>

              <Link
                href="/contact"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Users className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Contact Us</span>
                )}
              </Link>

              <Link
                href="/settings"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Settings className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Settings & Help</span>
                )}
              </Link>

              {(shouldExpand || isMobileMenuOpen) && (
                <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
                  <div className="px-2 text-xs text-muted-foreground text-center">© 2024 Caregene AI</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-[68] h-full w-80 max-w-[85vw] bg-sidebar/98 backdrop-blur border-r border-sidebar-border lg:hidden overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-sidebar-border flex items-center justify-between p-4">
              <Link
                href="/"
                className="flex items-center transition-all duration-200 space-x-3"
                onClick={closeMobileMenu}
              >
                <div className="flex-shrink-0 h-7 w-7">
                  <Image
                    src="/images/caregene-logo.png"
                    alt="Caregene AI"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-lg text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {/* New Chat */}
              <Link
                href="/"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3 touch-manipulation"
                onClick={closeMobileMenu}
              >
                <Plus className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-base text-sidebar-foreground">New Chat</span>
              </Link>

              {/* Search */}
              <div className="my-3">
                <div className="relative">
                  <div className="flex items-center rounded-lg border border-sidebar-border bg-sidebar-accent/5 h-10 px-3">
                    <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground mr-3" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-base text-sidebar-foreground placeholder:text-muted-foreground border-0 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="ml-2 p-1 hover:bg-sidebar-accent/20 rounded">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Search Results */}
                {isSearching && (
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/chat/${result.id}`}
                            className="block p-3 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <div className="text-sm font-medium text-sidebar-foreground truncate">{result.title}</div>
                            <div className="text-sm text-muted-foreground truncate mt-1">{result.content}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground text-center">No chats found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Projects - Mobile */}
              {projects.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {projects.map((project) => (
                    <div key={project.id} className="group">
                      {editingProject === project.id ? (
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <input
                            type="text"
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveProjectName(project.id)
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                            className="flex-1 text-sm bg-sidebar-accent/20 border border-sidebar-border rounded px-2 py-1 text-sidebar-foreground"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveProjectName(project.id)}
                            className="p-1 hover:bg-sidebar-accent/20 rounded text-green-600"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 hover:bg-sidebar-accent/20 rounded text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground group">
                          <Link
                            href={`/?project=${project.id}`}
                            className="flex items-center space-x-3 flex-1 min-w-0"
                            onClick={closeMobileMenu}
                          >
                            <FolderOpen className="h-4 w-4 flex-shrink-0 text-sidebar-primary opacity-60 group-hover:opacity-100" />
                            <div className="flex-1 min-w-0">
                              <span className="truncate block">{truncateProjectName(project.name)}</span>
                              {project.type !== "general" && (
                                <span className="text-xs text-muted-foreground/60">
                                  {projectTypes.find((t) => t.value === project.type)?.label || project.type}
                                </span>
                              )}
                            </div>
                          </Link>
                          <button
                            onClick={() => handleEditProject(project.id, project.name)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-sidebar-accent/20 rounded transition-opacity"
                            title="Edit project name"
                          >
                            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-sidebar-accent/20 rounded transition-opacity"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
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
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3 mb-3"
                onClick={closeMobileMenu}
              >
                <Clock className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-base text-sidebar-foreground">Recent Chats</span>
              </Link>

              <div className="border-t border-sidebar-border/50 mb-3" />

              {/* Parent Apps Section */}
              <div>
                <button
                  onClick={() => toggleSection("parent")}
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 justify-between space-x-3 px-3 touch-manipulation"
                >
                  <div className="flex items-center space-x-3">
                    <Dna className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-base font-medium text-sidebar-foreground">Care Hub</span>
                  </div>
                  {expandedSections.includes("parent") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>

                {expandedSections.includes("parent") && (
                  <div className="ml-8 mt-1">
                    {parentApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground touch-manipulation"
                        onClick={closeMobileMenu}
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
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 justify-between space-x-3 px-3 touch-manipulation"
                >
                  <div className="flex items-center space-x-3">
                    <FlaskConical className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-base font-medium text-sidebar-foreground">Research</span>
                  </div>
                  {expandedSections.includes("enterprise") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>

                {expandedSections.includes("enterprise") && (
                  <div className="ml-8 mt-1">
                    {enterpriseApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-foreground hover:text-muted-foreground touch-manipulation"
                        onClick={closeMobileMenu}
                      >
                        <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                        <span>{app.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-3 pb-4 border-t border-sidebar-border">
              <div className="py-3">
                <Link
                  href="/subscriptions"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <CreditCard className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Care Plans</span>
                </Link>

                <Link
                  href="/business"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Building2 className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">For Healthcare</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Users className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Contact Us</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Settings & Help</span>
                </Link>

                <div className="ml-8 mt-3 pt-3 border-t border-sidebar-border/50">
                  <div className="px-3 text-xs text-muted-foreground">© 2024 Caregene AI</div>
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
