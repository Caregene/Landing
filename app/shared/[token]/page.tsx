"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar, User, Shield } from "lucide-react"

interface SharedDocument {
  id: string
  title: string
  description?: string
  file_name: string
  file_size: number
  mime_type: string
  document_date?: string
  provider_name?: string
  tags: string[]
  extracted_text?: string
  created_at: string
  permission_level: "view" | "comment" | "edit"
  expires_at?: string
  shared_by_email?: string
}

export default function SharedDocumentPage() {
  const params = useParams()
  const token = params.token as string
  const [document, setDocument] = useState<SharedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedDocument = async () => {
      try {
        const response = await fetch(`/api/shared/${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load document")
        }

        setDocument(data.document)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchSharedDocument()
    }
  }, [token])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.includes("image")) return "🖼️"
    if (mimeType.includes("pdf")) return "📄"
    if (mimeType.includes("document") || mimeType.includes("word")) return "📝"
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊"
    return "📎"
  }

  const isExpired = document?.expires_at ? new Date(document.expires_at) < new Date() : false

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              {error || "This document is not available or the link has expired."}
            </p>
            <Button variant="outline" onClick={() => window.close()}>
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Link Expired</h2>
            <p className="text-muted-foreground mb-4">
              This shared document link has expired. Please request a new link from the document owner.
            </p>
            <Button variant="outline" onClick={() => window.close()}>
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Shared Document</h1>
                <p className="text-sm text-muted-foreground">Shared via Caregene DocHub</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {document.permission_level}
            </Badge>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Document Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getFileTypeIcon(document.mime_type)}</div>
                <div>
                  <CardTitle className="text-xl mb-2">{document.title}</CardTitle>
                  {document.description && <p className="text-muted-foreground mb-3">{document.description}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {document.document_date
                        ? new Date(document.document_date).toLocaleDateString()
                        : new Date(document.created_at).toLocaleDateString()}
                    </div>
                    {document.provider_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {document.provider_name}
                      </div>
                    )}
                    <div>{formatFileSize(document.file_size)}</div>
                  </div>
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardHeader>

          {document.tags && document.tags.length > 0 && (
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Document Preview/Content */}
        {document.extracted_text && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{document.extracted_text}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Viewer for PDFs and Images */}
        {(document.mime_type.includes("pdf") || document.mime_type.includes("image")) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Document preview will be available here</p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Full Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>This document was shared securely via Caregene</span>
              </div>
              {document.expires_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Expires {new Date(document.expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
