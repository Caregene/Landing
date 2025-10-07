"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { Edit3, RotateCcw } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [query])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Thinking...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 min-h-screen flex flex-col">
        {/* Query Display with Model Selector */}
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

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {/* AI Response */}
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-3.5 lg:gap-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 rounded-full bg-primary"></div>
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-3.5 lg:space-y-4">
                <div className="text-foreground">
                  <p className="mb-2 sm:mb-3 md:mb-3.5 lg:mb-4 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl leading-relaxed">
                    I'm Caregene's Rare gene LLM, specialized in rare diseases and genetic conditions. Here are some
                    ways I can assist you:
                  </p>

                  <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3.5 ml-2 sm:ml-3 md:ml-4 lg:ml-4">
                    <li className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5">
                      <span className="text-primary mt-1 text-sm">•</span>
                      <div className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl leading-relaxed">
                        <strong>Health guidance:</strong> symptoms, medication questions, care planning, etc.
                      </div>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5">
                      <span className="text-primary mt-1 text-sm">•</span>
                      <div className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl leading-relaxed">
                        <strong>Care coordination:</strong> appointment scheduling, insurance navigation, provider
                        communication, etc.
                      </div>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5">
                      <span className="text-primary mt-1 text-sm">•</span>
                      <div className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl leading-relaxed">
                        <strong>Daily support:</strong> meal planning, medication reminders, mobility assistance, etc.
                      </div>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5">
                      <span className="text-primary mt-1 text-sm">•</span>
                      <div className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl leading-relaxed">
                        <strong>Emergency preparedness:</strong> care plans, emergency contacts, medical information
                        organization, etc.
                      </div>
                    </li>
                  </ul>

                  <p className="mt-3 sm:mt-4 md:mt-4 lg:mt-5 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed">
                    You can also try Caregene Pro for comprehensive care management, including detailed health reports,
                    care team coordination, and personalized care plans.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 sm:pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-xs sm:text-sm md:text-sm lg:text-base h-8 sm:h-9"
                  >
                    <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 mr-1 sm:mr-1.5" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 border-t border-border/50">
            <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
              <SearchBar />
            </div>
            <div className="text-center mt-2 sm:mt-3 md:mt-3 lg:mt-4">
              <p className="text-xs sm:text-xs md:text-sm lg:text-base text-muted-foreground">
                Caregene can make mistakes, so double-check it
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
