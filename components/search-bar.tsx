"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Mic, Send } from "lucide-react"

export function SearchBar() {
  // Types
  type ChatMessage = { role: "user" | "assistant" | "system"; content: string }

  // Format messages for backend (OpenAI-like content parts)
  function formatMessagesForVLLM(
    messages: ChatMessage[]
  ): { role: string; content: { type: string; text: string }[] }[] {
    return messages.map(({ role, content }) => ({
      role,
      content: [{ type: "text", text: content }],
    }))
  }

  // Chat history state for context
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant." },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isSearchPage = pathname === "/search"

  // Document upload handler
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)
      const messages = JSON.stringify([
        { role: "user", content: [{ type: "text", text: searchQuery || "" }] },
      ])
      formData.append("messages", messages)

      const res = await fetch("http://localhost:8000/upload-and-ask", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Upload successful!" },
      ])
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Error uploading file" },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Voice input handler
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.")
      return
    }
    setIsRecording(true)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => {
      setIsRecording(false)
      alert("Voice recognition error.")
    }
    recognition.onend = () => {
      setIsRecording(false)
    }
    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)

    // Add user message to chat history
    const userMsg: ChatMessage = { role: "user", content: searchQuery.trim() }
    const updatedHistory = [...chatHistory, userMsg]
    setChatHistory(updatedHistory)
    setSearchQuery("")

    try {
      // Chat-only flow
      const res = await fetch("http://localhost:8000/upload-and-ask", {
        method: "POST",
        body: (() => {
          const formData = new FormData()
          formData.append("messages", JSON.stringify(formatMessagesForVLLM(updatedHistory)))
          return formData
        })(),
      })
      const data = await res.json()
      if (!res.ok) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.detail || data.error || "Query failed" },
        ])
        return
      }
      if (data.answer) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: String(data.answer) },
        ])
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Query successful, but no answer returned." },
        ])
      }
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: err?.message || "Error sending query" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {!isSearchPage && (
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Genetic counseling
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Symptom analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Research insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Care planning
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="ml-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Input
            type="text"
            placeholder="Ask Caregene about your health questions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent px-4 py-3 text-xs leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400 placeholder:text-xs min-h-[48px]"
            disabled={loading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            className={`mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600 ${isRecording ? "bg-primary/10" : ""}`}
            disabled={loading || isRecording}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {searchQuery.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        {/* Render chat history below the search bar */}
        <div className="mt-4 space-y-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === "assistant"
                  ? "bg-gray-100 p-3 rounded border border-gray-200"
                  : ""
              }
            >
              {/* Speaker label on its OWN line */}
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                {msg.role === "assistant" ? "AI" : msg.role === "user" ? "You" : "System"}
              </div>

              {/* Preserve newlines and wrap long lines so headings/paragraphs render correctly */}
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}
