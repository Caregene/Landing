"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Share2, Download, Eye, Calendar, User, Tag, Copy, Mail, Link } from "lucide-react"

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
  aiSummary?: string
  tags: string[]
  content?: string
  notes?: string
  source?: string
  isImportant?: boolean
}

interface DocumentViewerModalProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
  onShare?: (document: Document) => void
}

export function DocumentViewerModal({ document, isOpen, onClose, onShare }: DocumentViewerModalProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [shareUrl, setShareUrl] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  if (!document) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (type: string) => {
    if (type.includes("image")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("document") || type.includes("word")) return "📝"
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊"
    return "📎"
  }

  const handleShare = async () => {
    if (!document || !onShare) return

    setIsSharing(true)
    try {
      // Call the share function passed from parent
      onShare(document)

      // For demo purposes, generate a mock share URL
      const mockShareUrl = `${window.location.origin}/shared/${crypto.randomUUID()}`
      setShareUrl(mockShareUrl)
      setActiveTab("share")
    } catch (error) {
      console.error("Error sharing document:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getFileTypeIcon(document.type)}</div>
              <div>
                <DialogTitle className="text-xl mb-2">{document.name}</DialogTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </div>
                  {document.source && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {document.source}
                    </div>
                  )}
                  <div>{formatFileSize(document.size)}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing}>
                <Share2 className="h-4 w-4 mr-2" />
                {isSharing ? "Sharing..." : "Share"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="preview" className="mt-0">
              <div className="space-y-4">
                {/* Document Preview Area */}
                <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                  <p className="text-gray-600 mb-4">
                    {document.type.includes("pdf") && "PDF preview will be displayed here"}
                    {document.type.includes("image") && "Image preview will be displayed here"}
                    {document.type.includes("document") && "Document content will be displayed here"}
                    {!document.type.includes("pdf") &&
                      !document.type.includes("image") &&
                      !document.type.includes("document") &&
                      "File preview not available"}
                  </p>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Open Full Preview
                  </Button>
                </div>

                {/* Document Content */}
                {document.content && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Extracted Content</h4>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{document.content}</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              <div className="space-y-4">
                {document.aiSummary ? (
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-2 border-transparent rounded-lg p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-10 animate-pulse"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">AI-Generated Summary</h3>
                        <div className="flex gap-1 ml-auto">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{document.aiSummary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Summary Available</h3>
                    <p className="text-gray-600 mb-4">AI summary is being generated for this document.</p>
                    <Button variant="outline">Generate Summary</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <div className="space-y-4">
                {document.notes ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <h4 className="font-medium text-yellow-900">Your Notes</h4>
                    </div>
                    <p className="text-yellow-800 leading-relaxed">{document.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Added</h3>
                    <p className="text-gray-600 mb-4">Add your personal notes and comments about this document.</p>
                    <Button variant="outline">Add Note</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="share" className="mt-0">
              <div className="space-y-6">
                {shareUrl ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Link className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-900">Share Link Created</h4>
                      </div>
                      <p className="text-green-800 text-sm mb-3">
                        Anyone with this link can view the document. The link will expire in 7 days.
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white border border-green-300 rounded px-3 py-2 text-sm font-mono text-gray-700 truncate">
                          {shareUrl}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(shareUrl)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copySuccess ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Mail className="h-4 w-4" />
                        Email Link
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Share2 className="h-4 w-4" />
                        More Options
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Share2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Share This Document</h3>
                      <p className="text-gray-600 mb-4">Create a secure link to share this document with others.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Share Options</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>View-only access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Link expires in 7 days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>No account required to view</span>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleShare} disabled={isSharing} className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        {isSharing ? "Creating Link..." : "Create Share Link"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
