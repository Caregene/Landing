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

  // Debug logging
  console.log('Search page render - query:', query, 'sessionId:', sessionId)
  
  // Reset query processing flag when we navigate to a different session or clear session
  useEffect(() => {
    if (!query && !sessionId) {
      hasProcessedQuery.current = false
    }
  }, [query, sessionId])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputSectionRef = useRef<HTMLDivElement>(null)
  const hasProcessedQuery = useRef(false)

  // Initial scroll on component mount
  useEffect(() => {
    // Scroll to bottom when the component first mounts
    const initialScroll = () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }

    // Multiple attempts to ensure scroll happens
    setTimeout(initialScroll, 100)
    setTimeout(initialScroll, 300)
    setTimeout(initialScroll, 600)

    // Also scroll when window gains focus
    const handleFocus = () => {
      setTimeout(initialScroll, 100)
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Load session if sessionId is provided
  useEffect(() => {
    const loadSession = async () => {
      if (sessionId && isAuthenticated) {
        // Only load if we don't already have this session
        if (currentSession?.id !== sessionId) {
          try {
            console.log('Loading session from URL:', sessionId)
            console.log('Current session before loading:', currentSession?.id)
            const sessionData = await chatHistoryService.getSession(sessionId)
            setCurrentSession(sessionData)
            setMessages(sessionData.messages)
            console.log('Session loaded successfully:', sessionData.id, 'with', sessionData.messages.length, 'messages')
          } catch (error) {
            console.error('Error loading session:', error)
            
            // Check for authentication errors
            if (error instanceof Error && (
              error.message.includes('401') || 
              error.message.includes('Invalid or expired token') ||
              error.message.toLowerCase().includes('unauthorized')
            )) {
              localStorage.removeItem('authToken')
              localStorage.removeItem('userInfo')
              router.push('/signin')
              return
            }
          }
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

      // Only process URL query once when we first arrive with a query
      // Don't process if we already have a session or if sessionId is in URL or if already processed
      if (query.trim() && !sessionId && !currentSession && !hasProcessedQuery.current) {
        console.log('Processing URL query (first time):', query.trim())
        hasProcessedQuery.current = true
        handleUserMessage(query.trim())
        
        // Clear the query parameter after processing to prevent reprocessing
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('q')
        window.history.replaceState({}, '', newUrl.toString())
      }
    }

    // Small delay to ensure localStorage is accessible
    setTimeout(checkAuth, 500)
  }, [query, router, sessionId])

  // Auto-scroll to bottom when page loads
  useEffect(() => {
    if (isAuthenticated) {
      // Initial scroll when page loads and user is authenticated
      setTimeout(() => scrollToBottom(), 800)
      // Additional scroll to ensure input is visible
      setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="Ask"]') as HTMLElement
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 1200)
    }
  }, [isAuthenticated])

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 200)
    } else {
      // If no messages, ensure input area is visible
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 500)
    }
  }, [messages])

  const handleUserMessage = async (userQuery: string) => {
    // Add temporary user message immediately to UI for responsiveness
    const tempUserMessage: Message = {
      id: `temp-user-${Date.now()}`,
      content: userQuery,
      role: 'user',
      timestamp: new Date().toISOString(),
      metadata: { isTemporary: true }
    }
    
    // Show user message immediately
    setMessages(prev => [...prev, tempUserMessage])
    
    setIsLoading(true)
    localStorage.setItem('chatLoading', 'true') // Set loading flag for SearchBar
    
    // Scroll to bottom after adding user message
    setTimeout(() => scrollToBottom(), 100)
    
    try {
      let response: ChatResponse
      
      console.log('Current session state:', currentSession?.id)
      console.log('Session ID from URL:', sessionId)
      console.log('Messages count before sending:', messages.length)
      
      // Use currentSession state as primary, fallback to sessionId from URL
      const activeSessionId = currentSession?.id || sessionId
      
      if (activeSessionId && currentSession) {
        // Continue existing session
        console.log('Continuing existing session:', activeSessionId)
        response = await chatHistoryService.sendMessage(activeSessionId, userQuery)
      } else {
        // Start new session
        console.log('Starting new session because no active session found')
        response = await chatHistoryService.startChat(userQuery)
        console.log('New session created:', response.session.id)
        
        // Update URL with session ID to maintain session continuity
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set('session_id', response.session.id)
        newUrl.searchParams.delete('q') // Remove query param as it's been processed
        window.history.replaceState({}, '', newUrl.toString())
      }
      
      // Handle the response properly to avoid duplicates
      console.log('Response received:', response)
      console.log('Current messages count:', messages.length)
      
      // Always update the session state with the response session
      setCurrentSession(response.session)
      console.log('Session state updated to:', response.session.id)
      
      // Remove the temporary message and reload complete session to get accurate state
      try {
        const sessionData = await chatHistoryService.getSession(response.session.id)
        setMessages(sessionData.messages)
        setCurrentSession(sessionData) // Make sure we update the current session state
        console.log('Session reloaded with', sessionData.messages.length, 'messages')
        console.log('Current session updated to:', sessionData.id)
      } catch (sessionError) {
        console.error('Error reloading session:', sessionError)
        // Fallback: remove temp message and add real user + AI messages
        setMessages(prev => {
          const withoutTemp = prev.filter(msg => !msg.metadata?.isTemporary)
          const realUserMessage: Message = {
            id: `user-${Date.now()}`,
            content: userQuery,
            role: 'user',
            timestamp: new Date().toISOString()
          }
          return [...withoutTemp, realUserMessage, response.message]
        })
      }
      
      // Scroll to bottom after adding messages
      setTimeout(() => scrollToBottom(), 300)
      
    } catch (error) {
      console.error('Chat error:', error)
      
      // Check for authentication errors (both HTTP 401 and token error messages)
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('Invalid or expired token') ||
        error.message.toLowerCase().includes('unauthorized')
      )) {
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
      // Ensure scroll to bottom after response is fully processed
      setTimeout(() => scrollToBottom(), 500)
    }
  }

  const scrollToBottom = () => {
    // Use requestAnimationFrame to ensure DOM has been updated
    requestAnimationFrame(() => {
      setTimeout(() => {
        // First priority: scroll to the input section ref to ensure it's fully visible
        if (inputSectionRef.current) {
          inputSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        } else {
          // Fallback: find input element and scroll to it
          const inputElement = document.querySelector('input[type="text"]') || document.querySelector('textarea')
          if (inputElement) {
            inputElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            })
            // Add extra scroll to ensure input area is comfortably visible
            setTimeout(() => {
              window.scrollBy({
                top: 80,
                behavior: 'smooth'
              })
            }, 200)
          } else if (messagesEndRef.current) {
            // Scroll to messages end with extra space for input area
            messagesEndRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end',
              inline: 'nearest'
            })
            setTimeout(() => {
              window.scrollBy({
                top: 150,
                behavior: 'smooth'
              })
            }, 200)
          } else {
            // Last resort: scroll to very bottom
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            })
          }
        }
      }, 100)
    })
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



    // Auto-scroll when new messages are added or loading state changes
  useEffect(() => {
    if (messages.length > 0) {
      // Use a longer timeout to ensure content is fully rendered
      setTimeout(() => scrollToBottom(), 300)
    }
  }, [messages])

  // Also scroll when loading completes (AI response is fully rendered)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Longer delay to ensure AI response is fully rendered before scrolling
      setTimeout(() => scrollToBottom(), 600)
    }
  }, [isLoading, messages.length])

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
                      <div className={message.role === 'user' ? 'max-w-[95%]' : 'max-w-[85%]'}>
                        {/* Message Bubble */}
                        <div className={
                          message.role === 'user'
                            ? 'relative px-5 py-4 rounded-lg shadow-sm border-0 transition-all duration-200 bg-gray-100 text-gray-800 ml-auto'
                            : 'relative px-5 py-4 rounded-lg shadow-sm border-0 transition-all duration-200 bg-gray-800 text-white'
                        }>
                          {message.role === 'user' ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words hyphens-none" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{message.content}</p>
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
        <div ref={inputSectionRef} className="bg-background border-t border-border/50">
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
