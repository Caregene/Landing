"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Download,
  Search,
  Clock,
  BarChart3,
  ShoppingCart,
  Pill,
  Activity,
} from "lucide-react"

interface TrackerEntry {
  id: string
  category: "symptom" | "nutrition" | "medication"
  name: string
  severity?: number
  notes?: string
  timestamp: string
  data?: any
}

interface TrackerLogViewProps {
  onClose: () => void
}

export default function TrackerLogView({ onClose }: TrackerLogViewProps) {
  const [entries, setEntries] = useState<TrackerEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<TrackerEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null)
  const [dragEndDate, setDragEndDate] = useState<Date | null>(null)

  useEffect(() => {
    const loadRealEntries = () => {
      const allEntries: TrackerEntry[] = []

      // Load symptom entries
      const symptomEntries = JSON.parse(localStorage.getItem("caregene-symptom-entries") || "[]")
      symptomEntries.forEach((entry: any) => {
        allEntries.push({
          id: entry.id || `symptom-${entry.timestamp}`,
          category: "symptom",
          name: entry.name || "Symptom",
          severity: entry.data?.severity,
          notes: entry.data?.notes,
          timestamp: entry.timestamp,
          data: entry.data,
        })
      })

      // Load nutrition entries
      const nutritionEntries = JSON.parse(localStorage.getItem("caregene-nutrition-entries") || "[]")
      nutritionEntries.forEach((entry: any) => {
        allEntries.push({
          id: entry.id || `nutrition-${entry.timestamp}`,
          category: "nutrition",
          name: entry.name || "Nutrition",
          notes: entry.data?.notes,
          timestamp: entry.timestamp,
          data: entry.data,
        })
      })

      // Load medication entries
      const medicationEntries = JSON.parse(localStorage.getItem("caregene-medication-entries") || "[]")
      medicationEntries.forEach((entry: any) => {
        allEntries.push({
          id: entry.id || `medication-${entry.timestamp}`,
          category: "medication",
          name: entry.name || "Medication",
          notes: entry.data?.notes,
          timestamp: entry.timestamp,
          data: entry.data,
        })
      })

      // Sort by timestamp (newest first)
      allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      console.log("[v0] Loaded tracker entries:", allEntries)
      setEntries(allEntries)
      setFilteredEntries(allEntries)
    }

    loadRealEntries()
  }, [])

  // Filter entries based on search, dates, and category
  useEffect(() => {
    let filtered = entries

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (entry) =>
          entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Date filter
    if (selectedDates.length > 0) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.timestamp)
        entryDate.setHours(0, 0, 0, 0)
        return selectedDates.some((selectedDate) => {
          const compareDate = new Date(selectedDate)
          compareDate.setHours(0, 0, 0, 0)
          return entryDate.getTime() === compareDate.getTime()
        })
      })
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((entry) => entry.category === selectedCategory)
    }

    setFilteredEntries(filtered)
  }, [entries, searchQuery, selectedDates, selectedCategory])

  const formatDate = (dateInput: Date | string) => {
    const date = new Date(dateInput)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatTime = (dateInput: Date | string) => {
    const date = new Date(dateInput)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const isSameDay = (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.toDateString() === d2.toDateString()
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some((selectedDate) => isSameDay(date, selectedDate))
  }

  const handleDateClick = (date: Date) => {
    if (isDragging) return

    setSelectedDates((prev) => {
      const isAlreadySelected = prev.some((selectedDate) => isSameDay(date, selectedDate))
      if (isAlreadySelected) {
        return prev.filter((selectedDate) => !isSameDay(date, selectedDate))
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
      }
    })
  }

  const handleMouseDown = (date: Date) => {
    setIsDragging(true)
    setDragStartDate(date)
    setDragEndDate(date)
  }

  const handleMouseEnter = (date: Date) => {
    if (isDragging) {
      setDragEndDate(date)
    }
  }

  const handleMouseUp = () => {
    if (isDragging && dragStartDate && dragEndDate) {
      const startDate = new Date(Math.min(dragStartDate.getTime(), dragEndDate.getTime()))
      const endDate = new Date(Math.max(dragStartDate.getTime(), dragEndDate.getTime()))

      const newSelectedDates = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        newSelectedDates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setSelectedDates((prev) => {
        const combined = [...prev, ...newSelectedDates]
        const unique = combined.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)))
        return unique.sort((a, b) => a.getTime() - b.getTime())
      })
    }

    setIsDragging(false)
    setDragStartDate(null)
    setDragEndDate(null)
  }

  const isDateInDragRange = (date: Date) => {
    if (!isDragging || !dragStartDate || !dragEndDate) return false
    const startDate = new Date(Math.min(dragStartDate.getTime(), dragEndDate.getTime()))
    const endDate = new Date(Math.max(dragStartDate.getTime(), dragEndDate.getTime()))
    return date >= startDate && date <= endDate
  }

  const handleQuickDateFilter = (type: "3days" | "7days" | "30days") => {
    const now = new Date()
    const dates: Date[] = []
    let days = 0

    switch (type) {
      case "3days":
        days = 3
        break
      case "7days":
        days = 7
        break
      case "30days":
        days = 30
        break
    }

    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      dates.push(date)
    }

    setSelectedDates(dates)
    setShowCalendar(false)
  }

  const resetDateFilter = () => {
    setSelectedDates([])
    setShowCalendar(false)
  }

  const formatDateRange = () => {
    if (selectedDates.length === 0) return "All dates"
    if (selectedDates.length === 1) return formatDate(selectedDates[0])
    if (selectedDates.length <= 3) {
      return selectedDates.map((date) => formatDate(date)).join(", ")
    }
    return `${selectedDates.length} dates selected`
  }

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = isDateSelected(date)
      const isInDragRange = isDateInDragRange(date)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseDown={() => handleMouseDown(date)}
          onMouseEnter={() => handleMouseEnter(date)}
          onMouseUp={handleMouseUp}
          className={`p-2 rounded-full transition-colors select-none ${
            isSelected
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : isInDragRange
                ? "bg-blue-200 text-blue-800"
                : "hover:bg-gray-200"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "symptom":
        return <BarChart3 className="h-4 w-4 text-red-500" />
      case "nutrition":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />
      case "medication":
        return <Pill className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "symptom":
        return "bg-red-50 text-red-700 border-red-200"
      case "nutrition":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "medication":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tracker Log</h2>
            <p className="text-gray-600">View and manage your health tracking entries</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search and Category Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="symptom">Symptoms</option>
              <option value="nutrition">Nutrition</option>
              <option value="medication">Medication</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {formatDateRange()}
            </Button>

            {/* Quick date filters */}
            <Button variant="ghost" size="sm" onClick={() => handleQuickDateFilter("3days")}>
              3 Days
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleQuickDateFilter("7days")}>
              7 Days
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleQuickDateFilter("30days")}>
              30 Days
            </Button>

            {selectedDates.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resetDateFilter} className="text-red-600">
                Clear Filter
              </Button>
            )}
          </div>

          {/* Calendar */}
          {showCalendar && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </Card>
          )}
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedDates.length > 0 || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Start tracking to see your entries here"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getCategoryIcon(entry.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{entry.name}</h3>
                            <Badge className={getCategoryColor(entry.category)}>{entry.category}</Badge>
                            {entry.severity && <Badge variant="outline">Severity {entry.severity}/5</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(entry.timestamp)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(entry.timestamp)}
                            </div>
                          </div>
                          {entry.notes && (
                            <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredEntries.length} of {entries.length} entries
          </p>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
