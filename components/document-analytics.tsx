"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { FileText, Calendar, TrendingUp, Folder } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  category: string
  folder: string
  childId: string
  favorite: boolean
  tags: string[]
}

interface DocumentAnalyticsProps {
  documents: Document[]
  selectedChildId: string
}

export function DocumentAnalytics({ documents, selectedChildId }: DocumentAnalyticsProps) {
  // Filter documents for selected child
  const childDocuments = documents.filter((doc) => doc.childId === selectedChildId)

  // Calculate document type distribution
  const typeDistribution = childDocuments.reduce(
    (acc, doc) => {
      const type = doc.type.split("/")[0] || "other"
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: Math.round((count / childDocuments.length) * 100),
  }))

  // Calculate folder distribution
  const folderDistribution = childDocuments.reduce(
    (acc, doc) => {
      acc[doc.folder] = (acc[doc.folder] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const folderData = Object.entries(folderDistribution).map(([folder, count]) => ({
    folder: folder.charAt(0).toUpperCase() + folder.slice(1),
    count,
    percentage: Math.round((count / childDocuments.length) * 100),
  }))

  // Calculate upload trends (last 6 months)
  const uploadTrends = () => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })
      const year = date.getFullYear()

      const docsInMonth = childDocuments.filter((doc) => {
        const docDate = new Date(doc.uploadDate)
        return docDate.getMonth() === date.getMonth() && docDate.getFullYear() === date.getFullYear()
      }).length

      months.push({
        month: `${monthName} ${year}`,
        count: docsInMonth,
      })
    }

    return months
  }

  const trendData = uploadTrends()

  // Colors for charts
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

  // Calculate storage usage by type
  const storageByType = childDocuments.reduce(
    (acc, doc) => {
      const type = doc.type.split("/")[0] || "other"
      acc[type] = (acc[type] || 0) + doc.size
      return acc
    },
    {} as Record<string, number>,
  )

  const storageData = Object.entries(storageByType).map(([type, size]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    size: Math.round((size / 1024 / 1024) * 100) / 100, // Convert to MB
    sizeFormatted:
      size > 1024 * 1024 ? `${Math.round((size / 1024 / 1024) * 100) / 100} MB` : `${Math.round(size / 1024)} KB`,
  }))

  if (childDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Document Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No documents available for analysis</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{childDocuments.length}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Folder className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(folderDistribution).length}</p>
                <p className="text-sm text-muted-foreground">Active Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    childDocuments.filter((doc) => {
                      const docDate = new Date(doc.uploadDate)
                      const now = new Date()
                      return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((childDocuments.reduce((sum, doc) => sum + doc.size, 0) / 1024 / 1024) * 100) / 100}
                </p>
                <p className="text-sm text-muted-foreground">MB Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Document Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} documents`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Folder Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Documents by Folder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={folderData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="folder" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageData.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium">{item.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.sizeFormatted}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
