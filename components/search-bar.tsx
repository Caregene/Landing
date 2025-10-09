"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send } from "lucide-react"

interface SearchBarProps {
  onMessage?: (message: string) => void
}

export function SearchBar({ onMessage }: SearchBarProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isSearchPage = pathname === "/search"

  // Check if there's a request in progress
  useEffect(() => {
    const checkRequestStatus = () => {
      const isLoading = localStorage.getItem('chatLoading') === 'true'
      setIsRequestInProgress(isLoading)
    }

    checkRequestStatus()
    const interval = setInterval(checkRequestStatus, 500)
    
    return () => clearInterval(interval)
  }, [])

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Prevent multiple requests while one is in progress
    if (isRequestInProgress) {
      return
    }

    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      alert('Please log in to use the chat feature')
      router.push('/signin')
      return
    }

    // If already on search page and we have a message handler, use it
    if (isSearchPage && onMessage) {
      onMessage(searchQuery.trim())
      setSearchQuery('') // Clear the input
    } else if (isSearchPage) {
      // Fallback: update URL and let the page handle the new query
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}&t=${Date.now()}`
      router.push(newUrl)
      setSearchQuery('') // Clear the input
    } else {
      // Simply redirect to search page with the query
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (isSearchPage && onMessage) {
      onMessage(suggestion)
    } else {
      setSearchQuery(suggestion)
      router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    }
  }

  return (
    <div
      className={`${isSearchPage ? "relative" : "fixed bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 left-1/2 transform -translate-x-1/2"} w-full ${isSearchPage ? "max-w-full" : "max-w-[calc(100%-1rem)] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"} ${isSearchPage ? "" : "px-2 sm:px-4 md:px-4 lg:px-6"} z-50`}
    >
      {!isSearchPage && (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("Analyze my symptoms")}
            className="rounded-full text-sm px-4 py-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 h-auto"
          >
            Analyze my symptoms
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("Review health report")}
            className="rounded-full text-sm px-4 py-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 h-auto"
          >
            Review health report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("Create meal plan")}
            className="rounded-full text-sm px-4 py-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 h-auto"
          >
            Create meal plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("Track my progress")}
            className="rounded-full text-sm px-4 py-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 h-auto"
          >
            Track my progress
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="ml-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Button>

          <Input
            type="text"
            placeholder={isRequestInProgress ? "Please wait for response..." : "Ask me anything about your health..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isRequestInProgress}
            className={`flex-1 border-0 bg-transparent px-4 py-3 text-base leading-relaxed focus:ring-0 focus:outline-none min-h-[48px] transition-all duration-200 ${
              isRequestInProgress 
                ? 'placeholder:text-gray-400 text-gray-500 cursor-not-allowed' 
                : 'placeholder:text-gray-500'
            }`}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mr-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {searchQuery.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={isRequestInProgress}
              className={`mr-3 p-2 rounded-lg transition-all duration-200 ${
                isRequestInProgress 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {isRequestInProgress ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              console.log("File selected:", file.name)
              // Handle file upload
            }
          }}
        />
      </form>
    </div>
  )
}
