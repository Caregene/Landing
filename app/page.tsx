"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Stethoscope, FileText, BookOpen, Users, FlaskConical } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Check if user is authenticated before redirecting to search
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        // Store the intended query to use after login
        localStorage.setItem('pendingQuery', query.trim())
        alert('Please log in to use the AI chat feature')
        router.push('/signin')
        return
      }
      
      // User is authenticated, proceed to search page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const parentTools = [
    { icon: Stethoscope, title: "Health Journey", href: "/health-plan" },
    { icon: FileText, title: "DocHub", href: "/doc-hub" },
    { icon: BookOpen, title: "Condition Knowledge", href: "/condition-knowledge" },
    { icon: Users, title: "Community", href: "/community" },
  ]

  const researchTools = [{ icon: FlaskConical, title: "Research", href: "/research-platform" }]

  const examplePrompts = [
    "Signs of fever in toddlers?",
    "Prepare for checkup",
    "Explain genetic results",
    "Milestones for my 2 years old",
  ]

  return (
    <PageWrapper>
      <div className="h-[calc(100vh-3.5rem)] bg-white relative overflow-hidden">
        <main className="h-full overflow-y-auto flex items-center justify-center">
          <section className="w-full max-w-3xl mx-auto px-4 pb-32 sm:pb-36">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Meet CareGene
                </span>
                <br />
                <span className="text-gray-800 block mt-3 sm:mt-4">Your Healthcare AI Assistant</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-3 text-balance mt-6 sm:mt-8">
                {/* Placeholder for additional content */}
              </p>
              <p className="text-sm sm:text-base text-gray-500 text-balance mb-16 sm:mb-20">
                From symptoms, nutritions and milestones to genetic conditions and care guidance. Get instant,
                personalized answers powered by AI.
              </p>
            </div>

            <div className="mb-6 mt-16 sm:mt-20">
              <p className="text-xs sm:text-sm text-gray-400 text-center mb-3">Our tools for parents</p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {parentTools.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      className="group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 w-32 sm:w-40"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs sm:text-sm text-gray-400 text-center mb-3">For researchers</p>
              <div className="flex justify-center">
                {researchTools.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      className="group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 w-32 sm:w-40"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 sm:p-6">
          <div className="w-full max-w-3xl mx-auto">
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setQuery(prompt)}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-gray-700 transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-full shadow-lg p-2 sm:p-3"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask CareGene anything about your child's health..."
                className="flex-1 min-w-0 border-0 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </form>

            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3">
              By messaging Caregene AI, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-600">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
