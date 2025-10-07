"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Thermometer,
  Zap,
  Heart,
  Moon,
  AtomIcon as Stomach,
  Brain,
  Clock,
  Camera,
  Home,
  School,
  Building2,
  MoonIcon,
  Plus,
  Check,
  X,
  Calendar,
  User,
} from "lucide-react"

interface QuickChip {
  id: string
  label: string
  icon: React.ReactNode
  selected: boolean
}

interface RecentEntry {
  id: string
  type: string
  description: string
  severity?: number
  time: string
  author: string
}

export default function QuickLogPage() {
  const [selectedTime, setSelectedTime] = useState("now")
  const [severity, setSeverity] = useState([5])
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Symptom chips
  const [symptomChips, setSymptomChips] = useState<QuickChip[]>([
    { id: "fever", label: "Fever", icon: <Thermometer className="h-4 w-4" />, selected: false },
    { id: "seizure", label: "Seizure", icon: <Zap className="h-4 w-4" />, selected: false },
    { id: "pain", label: "Pain", icon: <Heart className="h-4 w-4" />, selected: false },
    { id: "sleep", label: "Sleep", icon: <Moon className="h-4 w-4" />, selected: false },
    { id: "gi", label: "GI", icon: <Stomach className="h-4 w-4" />, selected: false },
    { id: "mood", label: "Mood", icon: <Brain className="h-4 w-4" />, selected: false },
  ])

  // Context chips
  const [contextChips, setContextChips] = useState<QuickChip[]>([
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" />, selected: false },
    { id: "school", label: "School", icon: <School className="h-4 w-4" />, selected: false },
    { id: "clinic", label: "Clinic", icon: <Building2 className="h-4 w-4" />, selected: false },
    { id: "night", label: "Night", icon: <MoonIcon className="h-4 w-4" />, selected: false },
  ])

  // Recent entries for desktop sidebar
  const [recentEntries] = useState<RecentEntry[]>([
    {
      id: "1",
      type: "Symptom",
      description: "Seizure, Severe (7/10), 2m, Home",
      severity: 7,
      time: "9:41 AM Today",
      author: "Maya",
    },
    {
      id: "2",
      type: "Medication",
      description: "Levetiracetam 250 mg, PO, BID",
      time: "8:30 AM Today",
      author: "Maya",
    },
  ])

  const toggleChip = (chipType: "symptom" | "context", chipId: string) => {
    if (chipType === "symptom") {
      setSymptomChips((prev) => prev.map((chip) => (chip.id === chipId ? { ...chip, selected: !chip.selected } : chip)))
    } else {
      setContextChips((prev) => prev.map((chip) => (chip.id === chipId ? { ...chip, selected: !chip.selected } : chip)))
    }
  }

  const getSeverityLabel = (value: number) => {
    if (value === 0) return "None"
    if (value <= 3) return "Mild"
    if (value <= 6) return "Moderate"
    return "Severe"
  }

  const getSeverityColor = (value: number) => {
    if (value === 0) return "text-muted-foreground"
    if (value <= 3) return "text-yellow-600"
    if (value <= 6) return "text-orange-600"
    return "text-red-600"
  }

  const handleSave = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
    // Reset form
    setSymptomChips((prev) => prev.map((chip) => ({ ...chip, selected: false })))
    setContextChips((prev) => prev.map((chip) => ({ ...chip, selected: false })))
    setSeverity([5])
    setDuration("")
    setNotes("")
    setAttachedPhoto(null)
  }

  const handlePhotoAttach = () => {
    // Simulate photo attachment
    setAttachedPhoto("/medical-photo.jpg")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Saved. View timeline</span>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              Undo
            </Button>
          </div>
        </div>
      )}

      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Log Seizure</h1>
            <p className="text-muted-foreground">Capture what matters now. We'll handle the details.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="w-full">
                {/* Symptom Form Content */}
                <div className="space-y-6">
                  {/* Quick Symptom Chips */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Common symptoms</label>
                    <div className="flex flex-wrap gap-2">
                      {symptomChips.map((chip) => (
                        <Button
                          key={chip.id}
                          variant={chip.selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleChip("symptom", chip.id)}
                          className="h-10 px-3 gap-2"
                        >
                          {chip.icon}
                          {chip.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Time</label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedTime === "now" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime("now")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Now
                      </Button>
                      <Button
                        variant={selectedTime === "custom" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime("custom")}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Pick time
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <User className="h-3 w-3 inline mr-1" />
                      Logged by Maya
                    </p>
                  </div>

                  {/* Severity Slider */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Severity:{" "}
                      <span className={`font-semibold ${getSeverityColor(severity[0])}`}>
                        {severity[0]}/10 - {getSeverityLabel(severity[0])}
                      </span>
                    </label>
                    <Slider value={severity} onValueChange={setSeverity} max={10} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>None</span>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Duration</label>
                    <div className="flex gap-2 mb-2">
                      {["5m", "15m", "30m", "1h"].map((preset) => (
                        <Button
                          key={preset}
                          variant={duration === preset ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDuration(preset)}
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                    <Input
                      placeholder="Custom duration (e.g., 2h 30m)"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  {/* Context Tags */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Context</label>
                    <div className="flex flex-wrap gap-2">
                      {contextChips.map((chip) => (
                        <Button
                          key={chip.id}
                          variant={chip.selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleChip("context", chip.id)}
                          className="h-8 px-3 gap-2"
                        >
                          {chip.icon}
                          {chip.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Notes (optional)</label>
                    <Textarea
                      placeholder="What did you notice?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Photo Attachment */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Attach photo/video</label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={handlePhotoAttach} className="gap-2 bg-transparent">
                        <Camera className="h-4 w-4" />
                        Add photo
                      </Button>
                      {attachedPhoto && (
                        <div className="relative">
                          <img
                            src={attachedPhoto || "/placeholder.svg"}
                            alt="Attached"
                            className="h-16 w-16 rounded-lg object-cover border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => setAttachedPhoto(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border pt-4 mt-8 lg:relative lg:bg-transparent lg:border-t-0 lg:pt-0">
                  <div className="flex gap-3">
                    <Button onClick={handleSave} className="flex-1 lg:flex-none">
                      Save Entry
                    </Button>
                    <Button variant="outline" className="lg:flex-none bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent entries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No logs yet—your first entry takes seconds.</p>
                    </div>
                  ) : (
                    recentEntries.map((entry) => (
                      <div key={entry.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.type}
                          </Badge>
                          {entry.severity && (
                            <span className={`text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                              {entry.severity}/10
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium mb-1">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.time}, by {entry.author}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
