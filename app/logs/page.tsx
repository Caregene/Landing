"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Pill,
  Activity,
  TrendingUp,
  Search,
  Edit3,
  Trash2,
  Plus,
  Save,
  X,
  Filter,
} from "lucide-react"

interface LogEntry {
  id: string
  name: string
  timestamp: string
  category: "symptom" | "nutrition" | "medication"
  data?: {
    severity?: string
    duration?: string
    context?: string
    portionSize?: string
    time?: string
    doseTaken?: string
    notes?: string
  }
  childId?: string
}

export default function UnifiedLogsPage() {
  const router = useRouter()
  const [selectedChildId, setSelectedChildId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [typeFilters, setTypeFilters] = useState({
    symptom: true,
    nutrition: true,
    medication: true,
  })
  const [dateFilter, setDateFilter] = useState<"all" | "3days" | "7days" | "30days">("all")

  const [allEntries, setAllEntries] = useState<{
    symptom: LogEntry[]
    nutrition: LogEntry[]
    medication: LogEntry[]
  }>({
    symptom: [],
    nutrition: [],
    medication: [],
  })

  useEffect(() => {
    loadAllEntries()
  }, [selectedChildId])

  const loadAllEntries = () => {
    const symptomEntries = getLoggedEntriesForCategory("symptom")
    const nutritionEntries = getLoggedEntriesForCategory("nutrition")
    const medicationEntries = getLoggedEntriesForCategory("medication")

    setAllEntries({
      symptom: symptomEntries,
      nutrition: nutritionEntries,
      medication: medicationEntries,
    })
  }

  const getLoggedEntriesForCategory = (categoryType: string): LogEntry[] => {
    const storageKey = `caregene-${categoryType}-entries`
    const storedEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    return storedEntries
      .filter((entry: LogEntry) => !selectedChildId || entry.childId === selectedChildId)
      .sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const getAllEntries = (): LogEntry[] => {
    const combined = [
      ...(typeFilters.symptom ? allEntries.symptom.map((entry) => ({ ...entry, category: "symptom" as const })) : []),
      ...(typeFilters.nutrition
        ? allEntries.nutrition.map((entry) => ({ ...entry, category: "nutrition" as const }))
        : []),
      ...(typeFilters.medication
        ? allEntries.medication.map((entry) => ({ ...entry, category: "medication" as const }))
        : []),
    ]

    return combined
      .filter((entry) => {
        if (searchQuery) {
          const matchesSearch =
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.data?.notes?.toLowerCase().includes(searchQuery.toLowerCase())
          if (!matchesSearch) return false
        }

        if (dateFilter !== "all") {
          const entryDate = new Date(entry.timestamp)
          const now = new Date()
          const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

          switch (dateFilter) {
            case "3days":
              if (daysDiff > 3) return false
              break
            case "7days":
              if (daysDiff > 7) return false
              break
            case "30days":
              if (daysDiff > 30) return false
              break
          }
        }

        return true
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const getFilteredEntries = (category: string): LogEntry[] => {
    if (category === "all") return getAllEntries()

    const categoryEntries = allEntries[category as keyof typeof allEntries]

    return categoryEntries.filter((entry) => {
      if (searchQuery) {
        const matchesSearch =
          entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.data?.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchesSearch) return false
      }

      if (dateFilter !== "all") {
        const entryDate = new Date(entry.timestamp)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (dateFilter) {
          case "3days":
            if (daysDiff > 3) return false
            break
          case "7days":
            if (daysDiff > 7) return false
            break
          case "30days":
            if (daysDiff > 30) return false
            break
        }
      }

      return true
    })
  }

  const handleTypeFilterChange = (type: keyof typeof typeFilters, checked: boolean) => {
    setTypeFilters((prev) => ({
      ...prev,
      [type]: checked,
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (dateFilter !== "all") count++
    const enabledTypes = Object.values(typeFilters).filter(Boolean).length
    if (enabledTypes < 3) count++ // If not all types are enabled, count as a filter
    return count
  }

  const formatDate = (timestamp: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "symptom":
        return <Activity className="h-5 w-5 text-red-500" />
      case "nutrition":
        return <Utensils className="h-5 w-5 text-green-500" />
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />
      default:
        return <TrendingUp className="h-5 w-5 text-purple-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "symptom":
        return "bg-red-50 text-red-700 border-red-200"
      case "nutrition":
        return "bg-green-50 text-green-700 border-green-200"
      case "medication":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getSeverityColor = (severity?: string) => {
    if (!severity) return "bg-gray-300"
    const level = Number.parseInt(severity)
    if (level <= 2) return "bg-green-500"
    if (level <= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleEditEntry = (entry: LogEntry) => {
    setEditingEntry({ ...entry })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingEntry) return

    const storageKey = `caregene-${editingEntry.category}-entries`
    const storedEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const updatedEntries = storedEntries.map((entry: LogEntry) =>
      entry.timestamp === editingEntry.timestamp ? editingEntry : entry,
    )

    localStorage.setItem(storageKey, JSON.stringify(updatedEntries))
    loadAllEntries()
    setIsEditDialogOpen(false)
    setEditingEntry(null)
  }

  const handleDeleteEntry = (entry: LogEntry) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    const storageKey = `caregene-${entry.category}-entries`
    const storedEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const updatedEntries = storedEntries.filter((e: LogEntry) => e.timestamp !== entry.timestamp)

    localStorage.setItem(storageKey, JSON.stringify(updatedEntries))
    loadAllEntries()
  }

  const totalEntries = allEntries.symptom.length + allEntries.nutrition.length + allEntries.medication.length

  const renderEntryCard = (entry: LogEntry) => {
    const { date, time } = formatDate(entry.timestamp)

    return (
      <Card key={`${entry.category}-${entry.timestamp}`} className="hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getCategoryIcon(entry.category)}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <CardTitle className="text-base truncate">{entry.name}</CardTitle>
                  <Badge variant="secondary" className={`text-xs capitalize ${getCategoryColor(entry.category)}`}>
                    {entry.category}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {entry.data?.severity && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(entry.data.severity)}`}></div>
                  <span className="text-sm font-medium text-gray-700">{entry.data.severity}/5</span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteEntry(entry)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {entry.category === "symptom" && (
              <>
                {entry.data?.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Duration: {entry.data.duration}</span>
                  </div>
                )}
                {entry.data?.context && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>Context: {entry.data.context}</span>
                  </div>
                )}
              </>
            )}

            {entry.category === "nutrition" && (
              <>
                {entry.data?.portionSize && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <Utensils className="h-4 w-4 flex-shrink-0" />
                    <span>Portion: {entry.data.portionSize}</span>
                  </div>
                )}
                {entry.data?.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Meal time: {entry.data.time}</span>
                  </div>
                )}
              </>
            )}

            {entry.category === "medication" && (
              <>
                {entry.data?.doseTaken && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <Pill className="h-4 w-4 flex-shrink-0" />
                    <span>Dose: {entry.data.doseTaken}</span>
                  </div>
                )}
                {entry.data?.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-muted rounded-lg p-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Time taken: {entry.data.time}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {entry.data?.notes && (
            <div className="bg-card rounded-lg p-4 border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2">Notes</h4>
              <p className="text-muted-foreground leading-relaxed break-words">{entry.data.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={setSelectedChildId}>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => router.back()} variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Health Logs</h1>
                    <p className="text-muted-foreground">
                      {totalEntries} total {totalEntries === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Entry Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-filter"
                      checked={typeFilters.symptom}
                      onCheckedChange={(checked) => handleTypeFilterChange("symptom", checked as boolean)}
                    />
                    <label htmlFor="symptom-filter" className="text-sm text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-500" />
                      Symptoms ({allEntries.symptom.length})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nutrition-filter"
                      checked={typeFilters.nutrition}
                      onCheckedChange={(checked) => handleTypeFilterChange("nutrition", checked as boolean)}
                    />
                    <label htmlFor="nutrition-filter" className="text-sm text-muted-foreground flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-green-500" />
                      Nutrition ({allEntries.nutrition.length})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medication-filter"
                      checked={typeFilters.medication}
                      onCheckedChange={(checked) => handleTypeFilterChange("medication", checked as boolean)}
                    />
                    <label
                      htmlFor="medication-filter"
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <Pill className="h-4 w-4 text-blue-500" />
                      Medications ({allEntries.medication.length})
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Time Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={dateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("all")}
                    className="justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    All Time
                  </Button>
                  <Button
                    variant={dateFilter === "3days" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("3days")}
                    className="justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 3 Days
                  </Button>
                  <Button
                    variant={dateFilter === "7days" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("7days")}
                    className="justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 7 Days
                  </Button>
                  <Button
                    variant={dateFilter === "30days" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("30days")}
                    className="justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-card rounded-xl shadow-sm border p-4 mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All ({getAllEntries().length})
                </TabsTrigger>
                <TabsTrigger
                  value="symptom"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Symptoms ({getFilteredEntries("symptom").length})
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Nutrition ({getFilteredEntries("nutrition").length})
                </TabsTrigger>
                <TabsTrigger
                  value="medication"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Medication ({getFilteredEntries("medication").length})
                </TabsTrigger>
              </TabsList>
            </div>

            {["all", "symptom", "nutrition", "medication"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {getFilteredEntries(tab).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                          <TrendingUp className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            No {tab === "all" ? "" : tab} entries found
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {searchQuery || dateFilter !== "all" || getActiveFiltersCount() > 0
                              ? "Try adjusting your filters or search to see more results"
                              : `Start tracking ${tab === "all" ? "health data" : tab} to see entries here`}
                          </p>
                          <Button
                            onClick={() => router.push("/genetic-tracker")}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Entry
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredEntries(tab).map(renderEntryCard)
                )}
              </TabsContent>
            ))}
          </Tabs>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit {editingEntry?.category} Entry</DialogTitle>
              </DialogHeader>

              {editingEntry && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={editingEntry.name}
                      onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
                    />
                  </div>

                  {editingEntry.category === "symptom" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Severity (1-5)</label>
                        <Input
                          value={editingEntry.data?.severity || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, severity: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <Input
                          value={editingEntry.data?.duration || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, duration: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Context</label>
                        <Input
                          value={editingEntry.data?.context || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, context: e.target.value },
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {editingEntry.category === "nutrition" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Portion Size</label>
                        <Input
                          value={editingEntry.data?.portionSize || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, portionSize: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Meal Time</label>
                        <Input
                          value={editingEntry.data?.time || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, time: e.target.value },
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {editingEntry.category === "medication" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Dose Taken</label>
                        <Input
                          value={editingEntry.data?.doseTaken || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, doseTaken: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time Taken</label>
                        <Input
                          value={editingEntry.data?.time || ""}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              data: { ...editingEntry.data, time: e.target.value },
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <Textarea
                      value={editingEntry.data?.notes || ""}
                      onChange={(e) =>
                        setEditingEntry({
                          ...editingEntry,
                          data: { ...editingEntry.data, notes: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageWrapper>
  )
}
