"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageWrapper } from "@/components/page-wrapper"
import { Search, Mic, BookOpen, Users, FlaskConical, Heart, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react"

// Sample condition data based on the requirements
const conditions = [
  {
    id: "duchenne-md",
    name: "Duchenne Muscular Dystrophy",
    shortName: "DMD",
    prevalence: "1 in 3,500-5,000 boys",
    category: "Neuromuscular",
    severity: "Severe",
    overview: "A severe, progressive muscle-wasting disease caused by mutations in the dystrophin gene.",
    symptoms: {
      early: ["Muscle weakness in legs", "Delayed walking", "Frequent falls", "Difficulty climbing stairs"],
      progression: ["Loss of walking ability (ages 9-15)", "Respiratory complications", "Cardiac issues", "Scoliosis"],
    },
    diagnosis: {
      tests: ["Genetic testing", "CK blood test", "Muscle biopsy", "EMG"],
      timeTodiagnosis: "Average 2-3 years from first symptoms",
      challenges: "Often misdiagnosed as developmental delay initially",
    },
    treatments: [
      "Corticosteroids",
      "Physical therapy",
      "Respiratory support",
      "Cardiac monitoring",
      "Gene therapy trials",
    ],
    research: ["Exon-skipping therapies", "Gene editing approaches", "Utrophin upregulation"],
    dailyLife: "Progressive mobility loss, wheelchair use, full-time care needs",
    resources: ["Parent Project Muscular Dystrophy", "Muscular Dystrophy Association"],
  },
  {
    id: "phelan-mcdermid",
    name: "Phelan-McDermid Syndrome",
    shortName: "PMS",
    prevalence: "Thousands worldwide",
    category: "Genetic",
    severity: "Severe",
    overview: "Caused by deletions or mutations affecting the SHANK3 gene on chromosome 22.",
    symptoms: {
      early: ["Global developmental delay", "Speech impairment", "Hypotonia", "Feeding difficulties"],
      progression: ["Autism spectrum behaviors", "Seizures", "Sleep disturbances", "Sensory issues"],
    },
    diagnosis: {
      tests: ["Chromosomal microarray", "SHANK3 genetic testing", "Clinical evaluation"],
      timeTodiagnosis: "Often delayed due to rarity",
      challenges: "Symptoms overlap with autism spectrum disorder",
    },
    treatments: ["Speech therapy", "Occupational therapy", "Behavioral interventions", "Seizure management"],
    research: ["SHANK3 restoration trials", "Synaptic function studies", "IGF-1 therapy"],
    dailyLife: "High caregiver support, nonverbal communication systems, structured routines",
    resources: ["Phelan-McDermid Syndrome Foundation", "SHANK3 research networks"],
  },
  {
    id: "rett-syndrome",
    name: "Rett Syndrome",
    shortName: "RTT",
    prevalence: "1 in 10,000-15,000 girls",
    category: "Neurological",
    severity: "Severe",
    overview: "Neurological disorder linked to MECP2 mutations, primarily affecting girls.",
    symptoms: {
      early: ["Normal development 6-18 months", "Loss of hand skills", "Language regression"],
      progression: ["Breathing irregularities", "Seizures", "Scoliosis", "Movement disorders"],
    },
    diagnosis: {
      tests: ["MECP2 genetic testing", "Clinical criteria", "EEG"],
      timeTodiagnosis: "Usually diagnosed by age 2-3",
      challenges: "Initial symptoms may appear as autism",
    },
    treatments: ["Antiepileptics", "Breathing support", "Physical therapy", "Communication devices"],
    research: ["Gene therapy trials", "MECP2 reactivation", "Trofinetide treatment"],
    dailyLife: "Full-time caregiver support, communication devices, specialized equipment",
    resources: ["International Rett Syndrome Foundation", "Rett Syndrome Research Trust"],
  },
]

export default function ConditionKnowledgePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedConditions, setBookmarkedConditions] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredConditions = conditions.filter(
    (condition) =>
      condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.symptoms.early.some((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleBookmark = (conditionId: string) => {
    setBookmarkedConditions((prev) =>
      prev.includes(conditionId) ? prev.filter((id) => id !== conditionId) : [...prev, conditionId],
    )
  }

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    // Voice search implementation would go here
  }

  const handleViewDetails = (conditionId: string) => {
    router.push(`/condition-knowledge/${conditionId}`)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Condition Knowledge</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Trusted, parent-friendly information about rare genetic conditions
              </p>
            </div>
          </div>
        </div>

        <main className="px-4 py-6 max-w-7xl mx-auto">
          {/* Primary Search CTA */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conditions, symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-12 h-10 sm:h-12 text-sm sm:text-base"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${
                      isListening ? "text-red-500" : "text-muted-foreground"
                    }`}
                    onClick={handleVoiceSearch}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="default" className="h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Conditions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-foreground">150+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Conditions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <FlaskConical className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-foreground">45</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Trials</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-foreground">12K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Families</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-foreground">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Trust Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Condition Results */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <h2 className="text-lg sm:text-xl font-serif font-semibold">
                {searchQuery ? `Search Results (${filteredConditions.length})` : "Featured Conditions"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 sm:flex-none"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1 sm:flex-none"
                >
                  List
                </Button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"
              }
            >
              {filteredConditions.map((condition) => (
                <Card key={condition.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">{condition.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {condition.prevalence} • {condition.category}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Badge
                          variant={condition.severity === "Severe" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {condition.severity}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => toggleBookmark(condition.id)} className="p-1">
                          {bookmarkedConditions.includes(condition.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                      {condition.overview}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {condition.symptoms.early.slice(0, 2).map((symptom, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                      {condition.symptoms.early.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{condition.symptoms.early.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-sm"
                      onClick={() => handleViewDetails(condition.id)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredConditions.length === 0 && searchQuery && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No conditions found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try searching for different terms or browse our featured conditions
                  </p>
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}
