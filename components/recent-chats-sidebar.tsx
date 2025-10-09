/**
 * Recent Chats Sidebar Component
 * Displays recent chat sessions with chat history service integration
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Clock, Trash2, Archive, MoreHorizontal } from "lucide-react"
import { chatHistoryService, type ChatSession } from "@/lib/chat-history-service"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface RecentChatsSidebarProps {
  className?: string
  onChatSelect?: (sessionId: string) => void
  currentSessionId?: string
}

export function RecentChatsSidebar({ 
  className,
  onChatSelect,
  currentSessionId 
}: RecentChatsSidebarProps) {
  const [recentChats, setRecentChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadRecentChats()
  }, [])

  const loadRecentChats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await chatHistoryService.getRecentChats(20, 0)
      setRecentChats(response.sessions)
    } catch (err) {
      console.error('Error loading recent chats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatClick = (session: ChatSession) => {
    if (onChatSelect) {
      onChatSelect(session.id)
    } else {
      // Default behavior: navigate to search with session context
      router.push(`/search?session_id=${session.id}`)
    }
  }

  const handleDeleteChat = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await chatHistoryService.deleteSession(sessionId)
      setRecentChats(prev => prev.filter(chat => chat.id !== sessionId))
    } catch (err) {
      console.error('Error deleting chat:', err)
    }
  }

  const handleArchiveChat = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await chatHistoryService.archiveSession(sessionId)
      setRecentChats(prev => prev.filter(chat => chat.id !== sessionId))
    } catch (err) {
      console.error('Error archiving chat:', err)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Recent Chats</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Recent Chats</span>
        </div>
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">Recent Chats</span>
      </div>

      {recentChats.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          No recent chats yet.
          <br />
          Start a conversation to see your chat history here.
        </div>
      ) : (
        <div className="space-y-1">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={cn(
                "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-gray-50 border border-transparent",
                currentSessionId === chat.id && "bg-blue-50 border-blue-200",
                "flex items-start justify-between gap-2"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {chat.title || chat.first_user_message || 'New Chat'}
                  </div>
                  {chat.message_count && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {chat.message_count}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTimestamp(chat.last_activity || chat.updated_at)}
                  </span>
                </div>

                {chat.first_user_message && chat.first_user_message !== chat.title && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {truncateTitle(chat.first_user_message, 30)}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => handleArchiveChat(chat.id, e)}
                    className="text-xs"
                  >
                    <Archive className="w-3 h-3 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}