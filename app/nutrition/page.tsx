"use client"

import { useState, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Utensils, Calendar, Clock, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NutritionPage() {
  const router = useRouter()
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [nutritionEntries, setNutritionEntries] = useState([])

  useEffect(() => {
    const storageKey = "caregene-nutrition-entries"
    const storedEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const filteredEntries = storedEntries
      .filter((entry) => !selectedChildId || entry.childId === selectedChildId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setNutritionEntries(filteredEntries)
  }, [selectedChildId])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={setSelectedChildId}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
                    <p className="text-sm sm:text-base text-gray-600">
                      {nutritionEntries.length} nutrition {nutritionEntries.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push("/genetic-tracker?category=nutrition")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Nutrition Entry
              </Button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {nutritionEntries.length === 0 ? (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Utensils className="h-12 w-12 text-green-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No nutrition entries</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4">
                        Start tracking nutrition to see entries here
                      </p>
                      <Button
                        onClick={() => router.push("/genetic-tracker?category=nutrition")}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Entry
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              nutritionEntries.map((entry, index) => {
                const { date, time } = formatDate(entry.timestamp)
                return (
                  <Card
                    key={`nutrition-${entry.timestamp}`}
                    className="hover:shadow-md transition-all duration-200 hover:border-green-200"
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Utensils className="h-5 w-5 text-green-500 mt-1" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <CardTitle className="text-sm sm:text-base truncate">{entry.name}</CardTitle>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                Nutrition
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="truncate">{date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                        {entry.data?.portionSize && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                            <Utensils className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">Portion: {entry.data.portionSize}</span>
                          </div>
                        )}
                        {entry.data?.time && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">Meal time: {entry.data.time}</span>
                          </div>
                        )}
                      </div>
                      {entry.data?.notes && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border-l-4 border-green-500">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Notes</h4>
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                            {entry.data.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
