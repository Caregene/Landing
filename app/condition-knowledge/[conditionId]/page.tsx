"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowLeft,
  BookmarkCheck,
  Bookmark,
  Info,
  Activity,
  Lightbulb,
  AlertCircle,
  Stethoscope,
  FlaskConical,
  ExternalLink,
  Globe,
  FileText,
} from "lucide-react"

// Sample condition data (in a real app, this would come from an API or database)
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

interface ConditionDetailPageProps {
  params: {
    conditionId: string
  }
}

export default function ConditionDetailPage({ params }: ConditionDetailPageProps) {
  const router = useRouter()
  const [bookmarkedConditions, setBookmarkedConditions] = useState<string[]>([])

  const condition = conditions.find((c) => c.id === params.conditionId)

  if (!condition) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Condition Not Found</h1>
            <p className="text-muted-foreground mb-6">The condition you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/condition-knowledge")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Conditions
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const toggleBookmark = (conditionId: string) => {
    setBookmarkedConditions((prev) =>
      prev.includes(conditionId) ? prev.filter((id) => id !== conditionId) : [...prev, conditionId],
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.push("/condition-knowledge")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Conditions
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">{condition.name}</h1>
              <p className="text-muted-foreground text-lg">Comprehensive information and AI-powered insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={condition.severity === "Severe" ? "destructive" : "secondary"} className="text-sm">
                {condition.severity}
              </Badge>
              <Button variant="outline" onClick={() => toggleBookmark(condition.id)}>
                {bookmarkedConditions.includes(condition.id) ? (
                  <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {bookmarkedConditions.includes(condition.id) ? "Bookmarked" : "Bookmark"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground min-w-max">
              <TabsTrigger
                value="overview"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="symptoms"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Symptoms
              </TabsTrigger>
              <TabsTrigger
                value="diagnosis"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Diagnosis
              </TabsTrigger>
              <TabsTrigger
                value="treatment"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Treatment
              </TabsTrigger>
              <TabsTrigger
                value="management"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Management
              </TabsTrigger>
              <TabsTrigger
                value="research"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Research
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900"
              >
                Resources
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Summary</h4>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {condition.overview} This condition affects approximately {condition.prevalence} and is classified
                      as {condition.severity.toLowerCase()} in terms of impact on daily life.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Key Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prevalence:</span>
                    <span className="font-medium">{condition.prevalence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{condition.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Severity:</span>
                    <Badge variant={condition.severity === "Severe" ? "destructive" : "secondary"}>
                      {condition.severity}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    For Parents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Understanding {condition.shortName} can feel overwhelming. Remember that every child is unique, and
                    early intervention can make a significant difference in outcomes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="early-symptoms">
                <AccordionTrigger>Early Signs & Symptoms</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {condition.symptoms.early.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="progression">
                <AccordionTrigger>Disease Progression</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {condition.symptoms.progression.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="diagnosis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {condition.diagnosis.tests.map((test, index) => (
                    <Badge key={index} variant="outline" className="justify-center p-3">
                      {test}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time to Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{condition.diagnosis.timeTodiagnosis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{condition.diagnosis.challenges}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {condition.treatments.map((treatment, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{treatment}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Placeholder for Management content */}
            <Card>
              <CardHeader>
                <CardTitle>Management Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Management strategies for {condition.shortName} include various interventions and support systems.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4">Active Research Areas</h4>
                <ul className="space-y-3">
                  {condition.research.map((area, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FlaskConical className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Find Clinical Trials
            </Button>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="space-y-4">
              {condition.resources.map((resource, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{resource}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-medium">Save to Profile</h5>
                      <p className="text-sm text-muted-foreground">
                        Add this condition information to your health profile
                      </p>
                    </div>
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
