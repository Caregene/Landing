"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import PageWrapper from "@/components/page-wrapper"

const GeneticTracker = () => {
  const [selectedChildId, setSelectedChildId] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const router = useRouter()

  const [symptomData, setSymptomData] = useState({
    startTime: new Date().toISOString().slice(0, 16),
    duration: "",
    severity: 3,
    notes: "",
  })

  const medicationOptions = [
    { id: "morning", name: "Morning Dose", icon: "🌅" },
    { id: "afternoon", name: "Afternoon Dose", icon: "☀️" },
    { id: "evening", name: "Evening Dose", icon: "🌆" },
    { id: "night", name: "Night Dose", icon: "🌙" },
    { id: "asneeded", name: "As Needed", icon: "⚡" },
  ]

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
  }

  const handleMedicationClick = (medication) => {
    setSelectedItem(medication)
    setCurrentStep(2)
  }

  const handleSave = () => {
    const entry = {
      id: Date.now().toString(),
      type: "medication",
      name: selectedItem?.name || "Medication",
      data: symptomData,
      timestamp: new Date().toISOString(),
      childId: selectedChildId,
    }

    const existingEntries = JSON.parse(localStorage.getItem("caregene-medication-entries") || "[]")
    localStorage.setItem("caregene-medication-entries", JSON.stringify([...existingEntries, entry]))

    // Reset and redirect
    setCurrentStep(1)
    setSelectedItem(null)
    router.push("/genetic-tracker/logs")
  }

  const handleCancel = () => {
    setCurrentStep(1)
    setSelectedItem(null)
  }

  const handleInputChange = (field, value) => {
    setSymptomData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={handleChildSelect}>
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Medication Tracker
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                  Track your daily medications with precision. Monitor doses, timing, and effects to optimize your
                  treatment plan.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-100">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">24</div>
                    <div className="text-xs sm:text-sm text-gray-600">Doses This Week</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-100">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">95%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Adherence Rate</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-100">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active Medications</div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-4xl lg:text-5xl">💊</div>
                </div>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Select Medication Dose
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Choose the type of dose you want to log</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {medicationOptions.map((medication) => (
                  <Card
                    key={medication.id}
                    onClick={() => handleMedicationClick(medication)}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-border shadow-sm bg-card hover:border-blue-300"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{medication.icon}</div>
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{medication.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && selectedItem && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <button onClick={handleCancel} className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Selection
                </button>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Log {selectedItem.name}</h3>
              </div>

              <div className="border border-border shadow-sm bg-card rounded-xl p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Time</Label>
                      <Input
                        type="datetime-local"
                        value={symptomData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Duration (minutes)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 30"
                        value={symptomData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Severity (1-5)</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleInputChange("severity", level)}
                          className={`w-12 h-12 rounded-full border-2 font-medium transition-all duration-200 ${
                            symptomData.severity === level
                              ? "border-blue-500 bg-blue-500 text-white shadow-md"
                              : "border-gray-300 text-gray-600 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Notes</Label>
                    <Textarea
                      placeholder="Additional details..."
                      value={symptomData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm">
                      Save Entry
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-gray-400 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default GeneticTracker
