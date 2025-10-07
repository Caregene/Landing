"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Search, Trash2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LogEntry {
  id: string
  type: string
  title: string
  timestamp: string
  severity?: string
  notes?: string
  duration?: string
  dosage?: string
  quantity?: string
}

export default function TrackerLogsPage() {
  const params = useParams()
  const router = useRouter()
  const trackerType = params.type as "symptom" | "nutrition" | "medication"

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const loadLogs = () => {
      const storageKey = `caregene-${trackerType}-entries`
      const savedLogs = JSON.parse(localStorage.getItem(storageKey) || "[]")

      if (savedLogs.length === 0) {
        const sampleLogs = getSampleLogs()
        setLogs(sampleLogs)
        setFilteredLogs(sampleLogs)
      } else {
        setLogs(savedLogs)
        setFilteredLogs(savedLogs)
      }
    }

    loadLogs()
  }, [trackerType])

  useEffect(() => {
    let filtered = logs

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate)
          break
      }
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, dateFilter, typeFilter])

  const getSampleLogs = (): LogEntry[] => {
    const baseData = {
      symptom: [
        {
          id: "1",
          type: "Seizure",
          title: "Seizure Episode",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          severity: "Moderate",
          duration: "2 minutes",
          notes: "Occurred during sleep, lasted about 2 minutes",
        },
        {
          id: "2",
          type: "Pain/Discomfort",
          title: "Headache",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          severity: "Mild",
          notes: "Complained of headache after lunch",
        },
      ],
      nutrition: [
        {
          id: "1",
          type: "Breakfast",
          title: "Morning Meal",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          quantity: "Full portion",
          notes: "Ate well, finished everything",
        },
        {
          id: "2",
          type: "Water Intake",
          title: "Hydration",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          quantity: "250ml",
          notes: "Drank water after playing",
        },
      ],
      medication: [
        {
          id: "1",
          type: "Daily Medication",
          title: "Morning Dose",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          dosage: "5mg",
          notes: "Taken with breakfast as prescribed",
        },
        {
          id: "2",
          type: "Seizure Medication",
          title: "Emergency Dose",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          dosage: "2.5mg",
          notes: "Given during seizure episode",
        },
      ],
    }

    return baseData[trackerType] || []
  }

  const getTypeIcon = () => {
    const icons = {
      symptom: "🚨",
      nutrition: "🍽️",
      medication: "💊",
    }
    return icons[trackerType]
  }

  const getSeverityColor = (severity?: string) => {
    const colors = {
      Mild: "bg-yellow-100 text-yellow-800",
      Moderate: "bg-orange-100 text-orange-800",
      Severe: "bg-red-100 text-red-800",
    }
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const deleteLog = (id: string) => {
    const updatedLogs = logs.filter((log) => log.id !== id)
    setLogs(updatedLogs)

    const storageKey = `caregene-${trackerType}-entries`
    localStorage.setItem(storageKey, JSON.stringify(updatedLogs))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const uniqueTypes = [...new Set(logs.map((log) => log.type))]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon()}</span>
            <h1 className="text-2xl font-semibold capitalize">{trackerType} Logs</h1>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredLogs.length} entries
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Date filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
          </SelectContent>
        </Select>
        {uniqueTypes.length > 1 && (
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">{getTypeIcon()}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || dateFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : `Start tracking ${trackerType} data to see logs here.`}
              </p>
              <Button
                onClick={() => router.push(`/health-plan/tracker/${trackerType}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add {trackerType.charAt(0).toUpperCase() + trackerType.slice(1)} Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => {
            const { date, time } = formatTimestamp(log.timestamp)
            return (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {log.type}
                      </Badge>
                      {log.severity && <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLog(log.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium text-gray-900 mb-2">{log.title}</h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {time}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    {log.duration && (
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{log.duration}</span>
                      </div>
                    )}
                    {log.dosage && (
                      <div>
                        <span className="font-medium text-gray-700">Dosage:</span>
                        <span className="ml-2 text-gray-600">{log.dosage}</span>
                      </div>
                    )}
                    {log.quantity && (
                      <div>
                        <span className="font-medium text-gray-700">Quantity:</span>
                        <span className="ml-2 text-gray-600">{log.quantity}</span>
                      </div>
                    )}
                  </div>

                  {log.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="font-medium text-gray-700 text-sm">Notes:</span>
                      <p className="text-gray-600 text-sm mt-1">{log.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
