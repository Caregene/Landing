"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Clock, MessageCircle, Archive, Trash2, Search, Filter } from "lucide-react"
import { chatHistoryService, type ChatSession } from "@/lib/chat-history-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function RecentChatsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [recentChats, setRecentChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "recent" | "archived">("all")

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/signin')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  // Load recent chats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadRecentChats()
    }
  }, [isAuthenticated, filterType])

  const loadRecentChats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await chatHistoryService.getRecentChats(50, 0)
      setRecentChats(response.sessions)
    } catch (err) {
      console.error('Error loading recent chats:', err)
      
      // Check for authentication errors
      if (err instanceof Error && (
        err.message.includes('401') || 
        err.message.includes('Invalid or expired token') ||
        err.message.toLowerCase().includes('unauthorized')
      )) {
        localStorage.removeItem('authToken')
        router.push('/signin')
        return
      }
      
      setError(err instanceof Error ? err.message : 'Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatClick = (sessionId: string) => {
    router.push(`/search?session_id=${sessionId}`)
  }

  const handleDeleteChat = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return
    }

    try {
      await chatHistoryService.deleteSession(sessionId)
      setRecentChats(prev => prev.filter(chat => chat.id !== sessionId))
    } catch (err) {
      console.error('Error deleting chat:', err)
      alert('Failed to delete chat. Please try again.')
    }
  }

  const handleArchiveChat = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    try {
      await chatHistoryService.archiveSession(sessionId)
      setRecentChats(prev => prev.filter(chat => chat.id !== sessionId))
    } catch (err) {
      console.error('Error archiving chat:', err)
      alert('Failed to archive chat. Please try again.')
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const filteredChats = recentChats.filter(chat => {
    const matchesSearch = searchQuery === "" || 
      chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.first_user_message?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === "all" || 
      (filterType === "archived" && chat.is_archived) ||
      (filterType === "recent" && !chat.is_archived)
    
    return matchesSearch && matchesFilter
  })

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="fixed top-0 right-0 z-[40] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 left-0 lg:left-14">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Recent Chats</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 sm:w-80"
              />
            </div>
            
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterType === "all" ? "All" : filterType === "recent" ? "Active" : "Archived"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Chats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("recent")}>
                  Active Chats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("archived")}>
                  Archived Chats
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-20 lg:pl-14">
        <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your chats...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-destructive mb-4">Error: {error}</p>
                  <Button onClick={loadRecentChats} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl font-medium text-foreground mb-2">
                    {searchQuery ? "No chats found" : "No recent chats yet"}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search or filter settings"
                      : "Start a conversation to see your chat history here"
                    }
                  </p>
                  <Button 
                    onClick={() => router.push('/search')}
                    className="mt-2"
                  >
                    Start New Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className="group relative bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {chat.title || "Untitled Chat"}
                          </h3>
                          {chat.is_archived && (
                            <Archive className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        
                        {chat.first_user_message && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {chat.first_user_message}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatTimestamp(chat.updated_at)}</span>
                          {chat.message_count && (
                            <span>{chat.message_count} messages</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleArchiveChat(chat.id, e)}
                          className="h-8 w-8 p-0"
                          title="Archive chat"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}