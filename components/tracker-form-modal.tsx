"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider" // Added Slider import
import { X, Search } from "lucide-react"

interface TrackerFormModalProps {
  isOpen: boolean
  onClose: () => void
  category: "symptom" | "nutrition" | "medication" | null
  selectedOption?: string | null // Added selectedOption prop
  onSave: (data: any) => void
}

export function TrackerFormModal({ isOpen, onClose, category, selectedOption, onSave }: TrackerFormModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [existingEntries, setExistingEntries] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startTime: new Date().toISOString().slice(0, 16),
    severity: [3], // Changed to array for slider compatibility
    duration: "",
    notes: "",
    // Category-specific fields
    portionSize: "",
    doseTaken: "",
    time: "",
  })

  const searchInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && category) {
      // Load existing entries for this category
      const storageKey = `caregene-${category}-entries`
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]")
      setExistingEntries(stored)

      const initialName = selectedOption || ""
      setSearchTerm(initialName)
      setSelectedEntry(null)
      setFormData({
        name: initialName,
        startTime: new Date().toISOString().slice(0, 16),
        severity: [3], // Changed to array for slider
        duration: "",
        notes: "",
        portionSize: "",
        doseTaken: "",
        time: "",
      })
    }
  }, [isOpen, category, selectedOption])

  const filteredSuggestions = existingEntries
    .filter((entry) => entry.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0)
    .slice(0, 5) // Limit to 5 suggestions

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setFormData((prev) => ({ ...prev, name: value }))
    setShowSuggestions(value.length > 0)
    setSelectedEntry(null)
  }

  const handleSelectExisting = (entry: any) => {
    setSelectedEntry(entry)
    setSearchTerm(entry.name)
    setFormData((prev) => ({
      ...prev,
      name: entry.name,
      // Pre-fill some data from the existing entry if available
      ...(entry.data || {}),
    }))
    setShowSuggestions(false)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    const entryData = {
      id: Date.now().toString(),
      name: formData.name,
      data: {
        startTime: formData.startTime,
        severity: formData.severity[0], // Extract value from array
        duration: formData.duration,
        notes: formData.notes,
        ...(category === "nutrition" && {
          portionSize: formData.portionSize,
          time: formData.time,
        }),
        ...(category === "medication" && {
          doseTaken: formData.doseTaken,
          time: formData.time,
        }),
      },
      timestamp: new Date().toISOString(),
      childId: "default", // You can modify this based on your child selection logic
    }

    onSave(entryData)
    onClose()
  }

  const getCategoryConfig = () => {
    switch (category) {
      case "symptom":
        return {
          title: "Log Symptom",
          icon: "🤒",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      case "nutrition":
        return {
          title: "Log Nutrition",
          icon: "🛒",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "medication":
        return {
          title: "Log Medication",
          icon: "💊",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        }
      default:
        return {
          title: "Log Entry",
          icon: "📝",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  if (!isOpen || !category) return null

  const config = getCategoryConfig()

  const getSeverityLabel = (value: number) => {
    if (value === 0) return "None"
    if (value <= 2) return "Mild"
    if (value <= 3) return "Moderate"
    return "Severe"
  }

  const getSeverityColor = (value: number) => {
    if (value === 0) return "text-muted-foreground"
    if (value <= 2) return "text-yellow-600"
    if (value <= 3) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${config.bgColor} rounded-lg`}>
                <span className="text-2xl">{config.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600">{selectedEntry ? "Using existing entry" : "Add new entry"}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search/Name Input with Auto-complete */}
          <div className="space-y-4">
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700">
                {category === "symptom"
                  ? "Symptom Name"
                  : category === "nutrition"
                    ? "Food/Meal Name"
                    : "Medication Name"}
              </Label>
              <div className="relative mt-1">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Enter ${category} name...`}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Auto-complete Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((entry, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectExisting(entry)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{entry.name}</div>
                        <div className="text-sm text-gray-500">
                          Last logged: {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Use existing
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Input */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Time</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Category-specific fields */}
            {category === "symptom" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Duration (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Severity:{" "}
                    <span className={`font-semibold ${getSeverityColor(formData.severity[0])}`}>
                      {formData.severity[0]}/5 - {getSeverityLabel(formData.severity[0])}
                    </span>
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={formData.severity}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>None</span>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {category === "nutrition" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Portion Size</Label>
                  <Input
                    type="text"
                    placeholder="e.g., 1 cup, 2 slices"
                    value={formData.portionSize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, portionSize: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Meal Time</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Breakfast, Lunch, Snack"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {category === "medication" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Dose Taken</Label>
                  <Input
                    type="text"
                    placeholder="e.g., 10mg, 1 tablet"
                    value={formData.doseTaken}
                    onChange={(e) => setFormData((prev) => ({ ...prev, doseTaken: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Time Taken</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Morning, Evening, With meal"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Notes (Optional)</Label>
              <Textarea
                placeholder="Additional details..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Entry
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
