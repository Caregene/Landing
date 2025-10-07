"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Circle, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MilestoneItem {
  id: string
  title: string
  description: string
  category: "Social" | "Language" | "Motor" | "Cognitive"
  completed: boolean
  dueDate?: string
}

export default function MilestoneChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.childId as string
  const age = params.age as string

  const [milestones, setMilestones] = useState<MilestoneItem[]>([])
  const [childName, setChildName] = useState("")

  useEffect(() => {
    // Load child data and milestones
    const loadData = () => {
      // Load child name
      const childrenData = JSON.parse(localStorage.getItem("caregene-children") || "[]")
      const child = childrenData.find((c: any) => c.id === childId)
      setChildName(child?.name || "Child")

      // Load milestone data for the specific age
      const milestoneData: MilestoneItem[] = [
        {
          id: "1",
          title: "Responds to their name",
          description: "Child turns head or looks when their name is called",
          category: "Social",
          completed: false,
          dueDate: "2024-12-31",
        },
        {
          id: "2",
          title: "Shows affection for familiar people",
          description: "Hugs, kisses, or shows preference for family members",
          category: "Social",
          completed: true,
        },
        {
          id: "3",
          title: "Says several single words",
          description: "Uses 5-10 clear words consistently",
          category: "Language",
          completed: false,
          dueDate: "2024-12-15",
        },
        {
          id: "4",
          title: "Walks alone",
          description: "Takes several steps without support",
          category: "Motor",
          completed: true,
        },
        {
          id: "5",
          title: "Points to show others something interesting",
          description: "Uses pointing to share attention with others",
          category: "Cognitive",
          completed: false,
        },
        {
          id: "6",
          title: "Plays simple pretend games",
          description: "Pretends to feed a doll or talk on phone",
          category: "Cognitive",
          completed: false,
          dueDate: "2025-01-15",
        },
      ]

      // Load saved progress
      const savedProgress = JSON.parse(localStorage.getItem(`milestone-progress-${childId}-${age}`) || "[]")
      const updatedMilestones = milestoneData.map((milestone) => {
        const saved = savedProgress.find((s: any) => s.id === milestone.id)
        return saved ? { ...milestone, completed: saved.completed } : milestone
      })

      setMilestones(updatedMilestones)
    }

    loadData()
  }, [childId, age])

  const toggleMilestone = (id: string) => {
    const updatedMilestones = milestones.map((milestone) =>
      milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone,
    )
    setMilestones(updatedMilestones)

    // Save progress
    const progressData = updatedMilestones.map((m) => ({ id: m.id, completed: m.completed }))
    localStorage.setItem(`milestone-progress-${childId}-${age}`, JSON.stringify(progressData))
  }

  const completedCount = milestones.filter((m) => m.completed).length
  const totalCount = milestones.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getCategoryColor = (category: string) => {
    const colors = {
      Social: "bg-teal-100 text-teal-800",
      Language: "bg-blue-100 text-blue-800",
      Motor: "bg-green-100 text-green-800",
      Cognitive: "bg-purple-100 text-purple-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const groupedMilestones = milestones.reduce(
    (acc, milestone) => {
      if (!acc[milestone.category]) {
        acc[milestone.category] = []
      }
      acc[milestone.category].push(milestone)
      return acc
    },
    {} as Record<string, MilestoneItem[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Milestone Checklist</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <User className="h-4 w-4 mr-1" />
              {childName} • {age} milestones
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progress Overview</span>
            <span className="text-sm font-normal text-gray-600">
              {completedCount} of {totalCount} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% of milestones achieved</p>
        </CardContent>
      </Card>

      {/* Milestone Categories */}
      <div className="space-y-6">
        {Object.entries(groupedMilestones).map(([category, categoryMilestones]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className={getCategoryColor(category)}>{category}</Badge>
                <span className="text-sm font-normal text-gray-600">
                  {categoryMilestones.filter((m) => m.completed).length} of {categoryMilestones.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    milestone.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleMilestone(milestone.id)}
                >
                  <button className="mt-1">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-medium ${milestone.completed ? "text-green-800" : "text-gray-900"}`}>
                      {milestone.title}
                    </h3>
                    <p className={`text-sm mt-1 ${milestone.completed ? "text-green-600" : "text-gray-600"}`}>
                      {milestone.description}
                    </p>
                    {milestone.dueDate && !milestone.completed && (
                      <div className="flex items-center mt-2 text-xs text-orange-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/health-plan")}>
          Return to Health Plan
        </Button>
      </div>
    </div>
  )
}
