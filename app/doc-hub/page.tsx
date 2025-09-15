"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  Search,
  Grid3X3,
  List,
  Star,
  Share2,
  MoreVertical,
  FolderOpen,
  Mic,
  MicOff,
  Download,
  Edit3,
  Trash2,
  Move,
  Eye,
  Calendar,
  Folder,
  X,
  Check,
  Tag,
  StickyNote,
  Brain,
  FileDown,
  Plus,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageWrapper from "@/components/page-wrapper"

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
}

const defaultFolders = [
  { id: "all", name: "All Documents", color: "bg-gray-100 text-gray-800", count: 0, editable: false },
  { id: "labs", name: "Labs", color: "bg-blue-100 text-blue-800", count: 0, editable: true },
  { id: "reports", name: "Reports", color: "bg-green-100 text-green-800", count: 0, editable: true },
  { id: "prescriptions", name: "Prescriptions", color: "bg-purple-100 text-purple-800", count: 0, editable: true },
  { id: "school", name: "School", color: "bg-yellow-100 text-yellow-800", count: 0, editable: true },
  { id: "insurance", name: "Insurance", color: "bg-orange-100 text-orange-800", count: 0, editable: true },
  { id: "other", name: "Other", color: "bg-gray-100 text-gray-800", count: 0, editable: true },
]

export default function DocHubPage() {
  const [selectedChildId, setSelectedChildId] = useState<string>("child-1")
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState(defaultFolders)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNote, setVoiceNote] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showVoiceScribe, setShowVoiceScribe] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const [showDocumentDetails, setShowDocumentDetails] = useState(false)
  const [showRenameFolder, setShowRenameFolder] = useState(false)
  const [showMoveDocument, setShowMoveDocument] = useState(false)
  const [showTagDocument, setShowTagDocument] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedFolderToRename, setSelectedFolderToRename] = useState<string>("")
  const [newFolderName, setNewFolderName] = useState("")
  const [newTag, setNewTag] = useState("")
  const [documentNote, setDocumentNote] = useState("")

  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState({
    id: "child-1",
    name: "Ava Johnson",
    firstName: "Ava",
    age: 7,
    avatar: "/non-photorealistic-child-avatar.png",
  })

  const children = [
    {
      id: "child-1",
      name: "Ava Johnson",
      firstName: "Ava",
      age: 7,
      avatar: "/non-photorealistic-child-avatar.png",
    },
    {
      id: "child-2",
      name: "Liam Johnson",
      firstName: "Liam",
      age: 4,
      avatar: "/boy-avatar.png",
    },
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
    const child = children.find((c) => c.id === childId)
    if (child) {
      setSelectedChild(child)
    }
  }

  useEffect(() => {
    const loadDocuments = () => {
      try {
        const allDocuments = JSON.parse(localStorage.getItem("caregene-documents") || "[]")
        const childDocuments = selectedChildId
          ? allDocuments.filter((doc: Document) => doc.childId === selectedChildId)
          : allDocuments
        setDocuments(allDocuments)

        // Apply filters and search
        let filtered = childDocuments
        if (selectedFolder !== "all") {
          filtered = filtered.filter((doc: Document) => doc.folder === selectedFolder)
        }
        if (searchQuery) {
          filtered = filtered.filter(
            (doc: Document) =>
              doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
              doc.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }
        setFilteredDocuments(filtered)
      } catch (error) {
        console.error("Error loading documents:", error)
        setDocuments([])
        setFilteredDocuments([])
      }
    }

    loadDocuments()
  }, [selectedChildId, selectedFolder, searchQuery])

  useEffect(() => {
    const savedFolders = localStorage.getItem("caregene-folders")
    if (savedFolders) {
      try {
        const customFolders = JSON.parse(savedFolders)
        setFolders(customFolders)
      } catch (error) {
        console.error("Error loading folders:", error)
      }
    }
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files)
      setShowUploadDialog(true)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files)
      setShowUploadDialog(true)
    }
  }

  const uploadFiles = async (folder: string) => {
    if (!selectedFiles || !selectedChildId) return

    setIsUploading(true)
    const newDocuments: Document[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const doc: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: folder,
        folder: folder,
        childId: selectedChildId,
        favorite: false,
        tags: [],
        aiSummary: "AI summary will be generated shortly...",
        notes: "",
      }
      newDocuments.push(doc)
    }

    const existingDocs = JSON.parse(localStorage.getItem("caregene-documents") || "[]")
    const updatedDocs = [...existingDocs, ...newDocuments]
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))

    setDocuments(updatedDocs)
    setIsUploading(false)
    setShowUploadDialog(false)
    setSelectedFiles(null)
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // In a real app, you'd stop recording and process the audio
      setVoiceNote(
        "Doctor visit notes: Patient showed improvement in motor skills. Recommended continued therapy sessions twice weekly.",
      )
    } else {
      setIsRecording(true)
      setVoiceNote("")
    }
  }

  const saveVoiceNote = () => {
    if (!voiceNote.trim() || !selectedChildId) return

    const doc: Document = {
      id: Date.now().toString(),
      name: `Voice Note - ${new Date().toLocaleDateString()}`,
      type: "text/plain",
      size: voiceNote.length,
      uploadDate: new Date().toISOString(),
      category: "other",
      folder: "other",
      childId: selectedChildId,
      favorite: false,
      tags: ["voice-note", "doctor-visit"],
      content: voiceNote,
      aiSummary: "Voice note from doctor visit",
      notes: "",
    }

    const existingDocs = JSON.parse(localStorage.getItem("caregene-documents") || "[]")
    const updatedDocs = [...existingDocs, doc]
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setVoiceNote("")
    setShowVoiceScribe(false)
  }

  const toggleFavorite = (docId: string) => {
    const updatedDocs = documents.map((doc) => (doc.id === docId ? { ...doc, favorite: !doc.favorite } : doc))
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
  }

  const deleteDocument = (docId: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== docId)
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
  }

  const renameFolder = () => {
    if (!newFolderName.trim() || !selectedFolderToRename) return

    const updatedFolders = folders.map((folder) =>
      folder.id === selectedFolderToRename ? { ...folder, name: newFolderName } : folder,
    )
    setFolders(updatedFolders)
    localStorage.setItem("caregene-folders", JSON.stringify(updatedFolders))
    setShowRenameFolder(false)
    setNewFolderName("")
    setSelectedFolderToRename("")
  }

  const moveDocument = (newFolder: string) => {
    if (!selectedDocument) return

    const updatedDocs = documents.map((doc) =>
      doc.id === selectedDocument.id ? { ...doc, folder: newFolder, category: newFolder } : doc,
    )
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setShowMoveDocument(false)
    setSelectedDocument(null)
  }

  const exportDocument = (doc: Document) => {
    const dataStr = JSON.stringify(doc, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${doc.name.replace(/\.[^/.]+$/, "")}_export.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const addTagToDocument = () => {
    if (!selectedDocument || !newTag.trim()) return

    const updatedTags = [...selectedDocument.tags, newTag.trim()]
    const updatedDocs = documents.map((doc) => (doc.id === selectedDocument.id ? { ...doc, tags: updatedTags } : doc))
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setNewTag("")
  }

  const removeTagFromDocument = (tagToRemove: string) => {
    if (!selectedDocument) return

    const updatedTags = selectedDocument.tags.filter((tag) => tag !== tagToRemove)
    const updatedDocs = documents.map((doc) => (doc.id === selectedDocument.id ? { ...doc, tags: updatedTags } : doc))
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setSelectedDocument({ ...selectedDocument, tags: updatedTags })
  }

  const saveDocumentNote = () => {
    if (!selectedDocument) return

    const updatedDocs = documents.map((doc) => (doc.id === selectedDocument.id ? { ...doc, notes: documentNote } : doc))
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setShowAddNote(false)
    setDocumentNote("")
    setSelectedDocument(null)
  }

  const viewDocumentDetails = (doc: Document) => {
    setSelectedDocument(doc)
    setShowDocumentDetails(true)
  }

  const folderCounts = folders.map((folder) => ({
    ...folder,
    count:
      folder.id === "all"
        ? filteredDocuments.length
        : filteredDocuments.filter((doc) => doc.folder === folder.id).length,
  }))

  const totalDocuments = documents.filter((doc) => (selectedChildId ? doc.childId === selectedChildId : true)).length

  const recentUploads = documents
    .filter((doc) => (selectedChildId ? doc.childId === selectedChildId : true))
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 3)

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        {/* Patient Header - matching health plan implementation */}
        <div className="bg-card border-b border-border px-4 sm:px-6 py-2">
          <div className="flex items-center gap-4">
            <img
              src={selectedChild.avatar || "/placeholder.svg"}
              alt={selectedChild.firstName}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div
                    onMouseEnter={() => setIsChildDropdownOpen(true)}
                    onMouseLeave={() => setIsChildDropdownOpen(false)}
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                    >
                      <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                        {selectedChild.firstName}
                      </h1>
                      <button className="p-1 hover:bg-muted rounded-sm transition-colors">
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>

                    {isChildDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-[100] min-w-[200px]">
                        <div className="py-1">
                          {children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedChild(child)
                                setIsChildDropdownOpen(false)
                              }}
                            >
                              <img
                                src={child.avatar || "/placeholder.svg"}
                                alt={child.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <div className="text-sm sm:text-base font-medium text-gray-900">{child.firstName}</div>
                                <div className="text-xs sm:text-sm text-gray-500">Age {child.age}</div>
                              </div>
                            </div>
                          ))}
                          <div className="border-t border-border mt-1 pt-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors text-xs sm:text-sm">
                              <Plus className="w-4 h-4" />
                              <span>Manage Child</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Age {selectedChild.age}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Hub</h1>
                <p className="text-gray-600">Secure vault for all your child's health documents</p>
              </div>

              {/* Primary Upload CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base font-semibold shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedChildId}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Documents
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVoiceScribe(true)}
                  disabled={!selectedChildId}
                  className="px-6 py-3"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Voice Scribe
                </Button>
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                      <p className="text-sm text-gray-600">Total Documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Folder className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {folderCounts.filter((f) => f.count > 0).length - 1}
                      </p>
                      <p className="text-sm text-gray-600">Active Folders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{recentUploads.length}</p>
                      <p className="text-sm text-gray-600">Recent Uploads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Star className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          documents.filter(
                            (doc) => doc.favorite && (selectedChildId ? doc.childId === selectedChildId : true),
                          ).length
                        }
                      </p>
                      <p className="text-sm text-gray-600">Favorites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with folders */}
            <div className="lg:w-64 space-y-4">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Folders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {folderCounts.map((folder) => (
                    <div key={folder.id} className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedFolder(folder.id)}
                        className={`flex-1 flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          selectedFolder === folder.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{folder.name}</span>
                        </div>
                        <Badge className={folder.color}>{folder.count}</Badge>
                      </button>
                      {folder.editable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFolderToRename(folder.id)
                            setNewFolderName(folder.name)
                            setShowRenameFolder(true)
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              {/* Search and view controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                className={`min-h-96 border-2 border-dashed rounded-xl p-6 transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedChildId ? "No documents yet" : "Select a child to view documents"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {selectedChildId
                        ? "Upload your first document or drag and drop files here"
                        : "Choose a child from the dropdown above to manage their documents"}
                    </p>
                    {selectedChildId && (
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your First Document
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
                    }
                  >
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className={viewMode === "grid" ? "p-4" : "p-4"}>
                          <div
                            className={`flex ${viewMode === "grid" ? "flex-col" : "items-center justify-between"} gap-3`}
                          >
                            <div
                              className={`flex ${viewMode === "grid" ? "flex-col" : "items-center"} gap-3 ${viewMode === "list" ? "flex-1" : ""}`}
                            >
                              <div className={`flex items-center gap-3 ${viewMode === "grid" ? "w-full" : ""}`}>
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                    {doc.favorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                    {doc.notes && <StickyNote className="h-3 w-3 text-blue-500" />}
                                    {doc.tags.length > 0 && <Tag className="h-3 w-3 text-green-500" />}
                                  </div>
                                </div>
                              </div>

                              {viewMode === "grid" && doc.aiSummary && (
                                <p className="text-sm text-gray-600 line-clamp-2">{doc.aiSummary}</p>
                              )}

                              {doc.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {doc.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex-shrink-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewDocumentDetails(doc)}>
                                  <Brain className="h-4 w-4 mr-2" />
                                  View AI Summary
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportDocument(doc)}>
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleFavorite(doc.id)}>
                                  <Star
                                    className={`h-4 w-4 mr-2 ${doc.favorite ? "text-yellow-500 fill-current" : ""}`}
                                  />
                                  {doc.favorite ? "Remove from Favorites" : "Add to Favorites"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setShowMoveDocument(true)
                                  }}
                                >
                                  <Move className="h-4 w-4 mr-2" />
                                  Move to Folder
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setShowTagDocument(true)
                                  }}
                                >
                                  <Tag className="h-4 w-4 mr-2" />
                                  Manage Tags
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setDocumentNote(doc.notes || "")
                                    setShowAddNote(true)
                                  }}
                                >
                                  <StickyNote className="h-4 w-4 mr-2" />
                                  {doc.notes ? "Edit Note" : "Add Note"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => deleteDocument(doc.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedFiles && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select folder:</label>
                  <Select defaultValue="other">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {folders
                        .filter((f) => f.id !== "all")
                        .map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => uploadFiles("other")}
                    disabled={isUploading || !selectedChildId}
                    className="flex-1"
                  >
                    {isUploading ? "Uploading..." : "Upload Files"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showVoiceScribe} onOpenChange={setShowVoiceScribe}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Voice Scribe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Record your voice notes and we'll convert them to structured text, perfect for doctor visits.
                </p>

                <div className="flex items-center justify-center py-8">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                    className="w-24 h-24 rounded-full"
                  >
                    {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      Recording...
                    </div>
                  </div>
                )}

                {voiceNote && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Transcribed Notes:</label>
                    <Textarea
                      value={voiceNote}
                      onChange={(e) => setVoiceNote(e.target.value)}
                      rows={4}
                      placeholder="Your voice notes will appear here..."
                    />
                    <div className="flex gap-3">
                      <Button onClick={saveVoiceNote} className="flex-1">
                        <Check className="h-4 w-4 mr-2" />
                        Save as Document
                      </Button>
                      <Button variant="outline" onClick={() => setVoiceNote("")}>
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDocumentDetails} onOpenChange={setShowDocumentDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Document Details & AI Summary
                </DialogTitle>
              </DialogHeader>
              {selectedDocument && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-semibold">Name:</Label>
                      <p className="text-gray-700">{selectedDocument.name}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Size:</Label>
                      <p className="text-gray-700">{(selectedDocument.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Upload Date:</Label>
                      <p className="text-gray-700">{new Date(selectedDocument.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Folder:</Label>
                      <p className="text-gray-700">{folders.find((f) => f.id === selectedDocument.folder)?.name}</p>
                    </div>
                  </div>

                  {selectedDocument.tags.length > 0 && (
                    <div>
                      <Label className="font-semibold mb-2 block">Tags:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocument.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDocument.notes && (
                    <div>
                      <Label className="font-semibold mb-2 block">Notes:</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{selectedDocument.notes}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="font-semibold mb-2 block">AI Summary:</Label>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{selectedDocument.aiSummary}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => exportDocument(selectedDocument)} variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      Export Document
                    </Button>
                    <Button onClick={() => setShowDocumentDetails(false)}>Close</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showRenameFolder} onOpenChange={setShowRenameFolder}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter new folder name"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={renameFolder} disabled={!newFolderName.trim()}>
                    <Check className="h-4 w-4 mr-2" />
                    Rename
                  </Button>
                  <Button variant="outline" onClick={() => setShowRenameFolder(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showMoveDocument} onOpenChange={setShowMoveDocument}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Move Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Move "{selectedDocument?.name}" to a different folder:</p>
                <div className="grid grid-cols-2 gap-2">
                  {folders
                    .filter((f) => f.id !== "all" && f.id !== selectedDocument?.folder)
                    .map((folder) => (
                      <Button
                        key={folder.id}
                        variant="outline"
                        onClick={() => moveDocument(folder.id)}
                        className="justify-start"
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        {folder.name}
                      </Button>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showTagDocument} onOpenChange={setShowTagDocument}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Tags</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newTag">Add New Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newTag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag name"
                      onKeyPress={(e) => e.key === "Enter" && addTagToDocument()}
                    />
                    <Button onClick={addTagToDocument} disabled={!newTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedDocument && selectedDocument.tags.length > 0 && (
                  <div>
                    <Label>Current Tags:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDocument.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTagFromDocument(tag)} className="ml-1 hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={() => setShowTagDocument(false)}>Done</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedDocument?.notes ? "Edit Note" : "Add Note"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentNote">Note</Label>
                  <Textarea
                    id="documentNote"
                    value={documentNote}
                    onChange={(e) => setDocumentNote(e.target.value)}
                    placeholder="Add your notes about this document..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveDocumentNote}>
                    <Check className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddNote(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageWrapper>
  )
}
