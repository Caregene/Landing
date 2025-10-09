"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { Edit3, RotateCcw, UserCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import ReactMarkdown from 'react-markdown'
import Link from "next/link"
import { chatHistoryService, type Message, type ChatSession, type ChatResponse } from "@/lib/chat-history-service"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load session if sessionId is provided
  useEffect(() => {
    const loadSession = async () => {
      if (sessionId && isAuthenticated) {
        try {
          const sessionData = await chatHistoryService.getSession(sessionId)
          setCurrentSession(sessionData)
          setMessages(sessionData.messages)
        } catch (error) {
          console.error('Error loading session:', error)
        }
      }
    }

    loadSession()
  }, [sessionId, isAuthenticated])

  // Handle authentication and query processing
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken')
      console.log('Checking auth token:', authToken ? 'Found' : 'Not found')
      
      if (!authToken) {
        console.log('No auth token found, redirecting to signin')
        // Store current search query to restore after login
        if (query.trim()) {
          localStorage.setItem('pendingQuery', query.trim())
        }
        router.push('/signin')
        return
      }
      
      console.log('Auth token found, setting authenticated state')
      setIsAuthenticated(true)

      // If there's a query and no existing session, start new conversation
      if (query.trim() && !sessionId) {
        handleUserMessage(query.trim())
      }
    }

    // Small delay to ensure localStorage is accessible
    setTimeout(checkAuth, 500)
  }, [query, router, sessionId])

  const handleUserMessage = async (userQuery: string) => {
    setIsLoading(true)
    localStorage.setItem('chatLoading', 'true') // Set loading flag for SearchBar
    
    // Scroll to bottom after adding user message
    setTimeout(() => scrollToBottom(), 100)
    
    try {
      let response: ChatResponse
      
      if (currentSession) {
        // Continue existing session
        response = await chatHistoryService.sendMessage(currentSession.id, userQuery)
      } else {
        // Start new session
        response = await chatHistoryService.startChat(userQuery)
        setCurrentSession(response.session)
      }
      
      // Update messages with both user and AI messages
      const updatedMessages = [...messages]
      
      // Find user message by content (since we don't have the user message in response for continuing sessions)
      const existingUserMessage = updatedMessages.find(
        msg => msg.content === userQuery && msg.role === 'user' && 
               Math.abs(new Date(msg.timestamp).getTime() - Date.now()) < 10000 // within 10 seconds
      )
      
      if (!existingUserMessage) {
        // Create user message if not already added
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          content: userQuery,
          role: 'user',
          timestamp: new Date().toISOString()
        }
        updatedMessages.push(userMessage)
      }
      
      // Add AI response
      updatedMessages.push(response.message)
      setMessages(updatedMessages)
      
      // Scroll to bottom after adding AI response
      setTimeout(() => scrollToBottom(), 150)
      
    } catch (error) {
      console.error('Chat error:', error)
      
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userInfo')
        router.push('/signin')
        return
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Sorry, I'm having trouble connecting right now. Please try again."
      
      // Add error message to history
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
      localStorage.removeItem('chatLoading') // Clear loading flag
    }
  }

  const scrollToBottom = () => {
    // Try scrolling to the messages end ref first
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    } else if (chatContainerRef.current) {
      // Fallback: scroll the container to bottom
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const clearChatHistory = () => {
    setMessages([])
    setCurrentSession(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('chatLoading')
    localStorage.removeItem('pendingQuery')
    setMessages([])
    setCurrentSession(null)
    router.push('/')
  }



  // Auto-scroll when new messages are added
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages, isLoading])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Fixed Authentication Header */}
      <div className="fixed top-0 right-0 z-[50] bg-white/95 backdrop-blur-sm border-b border-border/20 left-0 lg:left-14">
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 md:px-6">
          {/* Left side - empty for now */}
          <div></div>

            {/* Right side - authentication */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
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
                      <div className="font-medium text-sm">Admin User</div>
                      <div className="text-xs text-gray-500">admin@admin.com</div>
                    </div>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>My Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" size="sm" className="text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 min-h-screen pt-14">
        {/* Query Display */}
        {query && (
          <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 text-muted-foreground">
                <Edit3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-4.5 xl:w-4.5" />
                <span className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-base truncate max-w-[250px] sm:max-w-none">
                  {query}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-full sm:max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
                  <span className="text-white text-2xl">🏥</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  CareGene
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Healthcare AI Assistant
                </p>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                  Ask me anything about healthcare, symptoms, medical conditions, or general health guidance.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Chat Header */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
                  {/* Centered CareGene Branding */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md mb-3">
                      <span className="text-white text-xl">🏥</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      CareGene
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Healthcare AI Assistant</p>
                  </div>

                  {/* Action buttons */}
                  {messages.length > 0 && (
                    <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={scrollToBottom}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 transition-all duration-200"
                      >
                        <span className="text-xs">↓</span>
                        <span className="hidden sm:inline ml-1">Scroll to Bottom</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Stats bar */}
                  {messages.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                      </span>
                      <span className="text-gray-400">
                        {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div 
                  ref={chatContainerRef}
                  className="space-y-6 pr-2 chat-container"
                >
                  {messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={
                        message.role === 'user' 
                          ? 'flex justify-end animate-fadeIn'
                          : 'flex justify-start animate-fadeIn'
                      }
                    >
                      <div className="max-w-[85%]">
                        {/* Message Bubble */}
                        <div className={
                          message.role === 'user'
                            ? 'relative px-5 py-4 rounded-lg shadow-sm border-0 transition-all duration-200 bg-gray-100 text-gray-800 max-w-[90%] ml-auto'
                            : 'relative px-5 py-4 rounded-lg shadow-sm border-0 transition-all duration-200 bg-gray-800 text-white'
                        }>
                          {message.role === 'user' ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          ) : (
                            <div className="text-sm ai-message-content">
                              <ReactMarkdown>
                                {message.content
                                  .replace(/^- \*\*/gm, '• **')
                                  .replace(/^-\s+/gm, '• ')
                                }
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Message */}
                  {isLoading && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="max-w-[85%]">
                        <div className="bg-gray-800 text-white shadow-md rounded-lg px-5 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-300">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll target with padding */}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>
            )}
          </div>

        {/* Input Section */}
        <div className="bg-background border-t border-border/50">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
            <div className="max-w-full sm:max-w-4xl mx-auto">
              <SearchBar onMessage={handleUserMessage} />
            </div>
            <div className="text-center mt-2 sm:mt-3 md:mt-3 lg:mt-4">
              <p className="text-xs sm:text-xs md:text-sm lg:text-base text-muted-foreground">
                AI can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
