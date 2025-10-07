"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mic, Plus } from "lucide-react"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function HeroSection() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setQuery(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } else {
        setIsSupported(false)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleVoiceInput = () => {
    if (!isSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || selectedFiles.length > 0) {
      const searchParams = new URLSearchParams()
      if (query.trim()) searchParams.set("q", query.trim())
      if (selectedFiles.length > 0) searchParams.set("files", selectedFiles.length.toString())
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleSuggestionClick = (condition: string) => {
    setQuery(`Tell me about ${condition}`)
    const searchParams = new URLSearchParams()
    searchParams.set("q", `Tell me about ${condition}`)
    router.push(`/search?${searchParams.toString()}`)
  }

  const handleAttach = () => {
    fileInputRef.current?.click()
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh] xl:min-h-[70vh] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4">
          <span className="text-black">Meet </span>
          <span className="text-black">CareGene</span>
          <span className="text-black">,</span>
        </h1>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-4 sm:mb-6 md:mb-8">
          <span className="text-blue-600">your personal Healthcare AI Assistant</span>
        </h2>
      </div>

      <div className="fixed bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-1rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 z-40">
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 sm:justify-center">
            <button
              onClick={() => handleSuggestionClick("Phelan-McDermid Syndrome (PMS)")}
              className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg text-[11px] sm:text-sm leading-tight text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
            >
              Best nutritions for a child with PMS
            </button>
            <button
              onClick={() => handleSuggestionClick("Fragile X Syndrome")}
              className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg text-[11px] sm:text-sm leading-tight text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
            >
              Create a HIIT Training Plan
            </button>
            <button
              onClick={() => handleSuggestionClick("Rett Syndrome")}
              className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg text-[11px] sm:text-sm leading-tight text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
            >
              Simplify a genetics report
            </button>
            <button
              onClick={() => handleSuggestionClick("Healthy meal prep")}
              className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg text-[11px] sm:text-sm leading-tight text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
            >
              Healthy meal prep ideas
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-4 p-3 bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm">
                  <span className="truncate max-w-32">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-primary hover:text-primary/70 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1 sm:gap-1.5 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:border-gray-400 p-1.5 sm:p-2 md:p-2.5 lg:p-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleAttach}
            className="flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Attach files"
          >
            <Plus className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Caregene about your health questions"
            className="flex-1 min-w-0 border-0 bg-transparent px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full transition-colors ${
              isListening ? "bg-red-500 text-white animate-pulse" : "hover:bg-gray-100 text-gray-600"
            }`}
            title={isListening ? "Stop listening" : "Start voice search"}
          >
            <Mic className="h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() && selectedFiles.length === 0}
            className="flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </form>

        <div className="text-center mt-2 sm:mt-3">
          <p className="text-[9px] sm:text-xs text-muted-foreground">
            By messaging Caregene AI, you agree to our <span className="underline">Terms</span> and have read our{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>

        {isListening && (
          <div className="text-center mt-2">
            <p className="text-sm text-blue-600 animate-pulse">Listening... Ask me anything about health</p>
          </div>
        )}
      </div>
    </section>
  )
}
