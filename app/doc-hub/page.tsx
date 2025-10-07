"use client"

import type React from "react"
import { DocumentAnalytics } from "@/components/document-analytics"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Upload,
  Search,
  Grid3X3,
  List,
  FolderOpen,
  Mic,
  Edit3,
  Eye,
  Plus,
  ChevronDown,
  Star,
  Tag,
  MoreHorizontal,
  FileImage,
  FileSpreadsheet,
  File,
  X,
  Check,
} from "lucide-react"
import PageWrapper from "@/components/page-wrapper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu" // Added DropdownMenu components
import { DocumentViewerModal } from "@/components/document-viewer-modal" // Added DocumentViewerModal

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

const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Blood Test Results - CBC Panel",
    type: "application/pdf",
    size: 245760,
    uploadDate: "2024-01-15T10:30:00Z",
    category: "labs",
    folder: "labs",
    childId: "child-1",
    favorite: false,
    tags: ["Lab", "CBC", "Routine"],
    source: "Children's Hospital",
    isImportant: true,
  },
  {
    id: "2",
    name: "Pediatric Growth Chart",
    type: "image/png",
    size: 156432,
    uploadDate: "2024-01-12T14:20:00Z",
    category: "reports",
    folder: "reports",
    childId: "child-1",
    favorite: true,
    tags: ["Report", "Growth", "Pediatric"],
    source: "Patient Portal",
    isImportant: false,
  },
  {
    id: "3",
    name: "Amoxicillin Prescription",
    type: "application/pdf",
    size: 89234,
    uploadDate: "2024-01-10T09:15:00Z",
    category: "prescriptions",
    folder: "prescriptions",
    childId: "child-1",
    favorite: false,
    tags: ["Rx", "Antibiotic"],
    source: "Dr. Martinez Clinic",
    isImportant: false,
  },
  {
    id: "4",
    name: "IEP Meeting Notes",
    type: "application/docx",
    size: 123456,
    uploadDate: "2024-01-08T16:45:00Z",
    category: "school",
    folder: "school",
    childId: "child-1",
    favorite: false,
    tags: ["Report", "IEP", "Education"],
    source: "Lincoln Elementary",
    isImportant: true,
  },
  {
    id: "5",
    name: "Insurance Coverage Summary",
    type: "application/pdf",
    size: 198765,
    uploadDate: "2024-01-05T11:30:00Z",
    category: "insurance",
    folder: "insurance",
    childId: "child-1",
    favorite: false,
    tags: ["Insurance", "Coverage"],
    source: "BlueCross Portal",
    isImportant: false,
  },
  {
    id: "6",
    name: "Vaccination Record",
    type: "image/jpeg",
    size: 234567,
    uploadDate: "2024-01-03T13:20:00Z",
    category: "reports",
    folder: "reports",
    childId: "child-1",
    favorite: true,
    tags: ["Report", "Vaccines", "Immunization"],
    source: "Pediatric Clinic",
    isImportant: true,
  },
]

const defaultFolders = [
  { id: "all", name: "All Documents", color: "bg-gray-100 text-gray-800", count: 0, editable: false },
  { id: "labs", name: "Labs", color: "bg-blue-100 text-blue-800", count: 0, editable: true },
  { id: "reports", name: "Reports", color: "bg-green-100 text-green-800", count: 0, editable: true },
  { id: "prescriptions", name: "Prescriptions", color: "bg-purple-100 text-purple-800", count: 0, editable: true },
  { id: "school", name: "School", color: "bg-yellow-100 text-yellow-800", count: 0, editable: true },
  { id: "insurance", name: "Insurance", color: "bg-orange-100 text-orange-800", count: 0, editable: true },
  { id: "other", name: "Other", color: "bg-gray-100 text-gray-800", count: 0, editable: true },
]

export default function DocumentHub() {
  const [selectedChildId, setSelectedChildId] = useState("child-1")
  const [documents, setDocuments] = useState<Document[]>([]) // Start with empty array to show empty state
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]) // Start with empty array
  const [folders, setFolders] = useState(defaultFolders)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNote, setVoiceNote] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showVoiceScribe, setShowVoiceScribe] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]) // Added multi-select state

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
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

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
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const [currentTipSlide, setCurrentTipSlide] = useState(0)
  const [emailAddress] = useState("docs+ava@caregene.com")
  const [copySuccess, setCopySuccess] = useState(false)

  const [workbenchSelectedDoc, setWorkbenchSelectedDoc] = useState<Document | null>(null)
  const [workbenchTab, setWorkbenchTab] = useState("summary")

  // Added state for Document Viewer Modal
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [viewerDocument, setViewerDocument] = useState<Document | null>(null)

  const getFileTypeIcon = (type: string) => {
    if (type.includes("image")) return <FileImage className="h-6 w-6" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="h-6 w-6" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-6 w-6" />
    return <File className="h-6 w-6" />
  }

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const toggleImportant = (docId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, isImportant: !doc.isImportant } : doc)))
  }

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
    const child = children.find((c) => c.id === childId)
    if (child) {
      setSelectedChild(child)
    }
    setIsChildDropdownOpen(false)
  }

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipSlide((prev) => (prev + 1) % 2)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadDocuments = () => {
      try {
        const allDocuments = documents
        const childDocuments = selectedChildId
          ? allDocuments.filter((doc: Document) => doc.childId === selectedChildId)
          : allDocuments

        // Apply filters and search
        let filtered = childDocuments
        if (selectedFolder !== "all") {
          filtered = filtered.filter((doc: Document) => doc.folder === selectedFolder)
        }
        if (searchTerm) {
          filtered = filtered.filter(
            (doc: Document) =>
              doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
              doc.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }
        if (activeFilters.includes("Type")) {
          filtered = filtered.filter((doc: Document) => doc.type !== "application/octet-stream")
        }
        if (activeFilters.includes("Date")) {
          filtered = filtered.filter((doc: Document) => doc.uploadDate !== "")
        }
        if (activeFilters.includes("Status")) {
          filtered = filtered.filter((doc: Document) => doc.favorite !== false)
        }

        filtered.sort((a, b) => {
          switch (sortBy) {
            case "oldest":
              return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
            case "name":
              return a.name.localeCompare(b.name)
            case "size":
              return b.size - a.size
            default: // newest
              return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          }
        })

        setFilteredDocuments(filtered)
      } catch (error) {
        console.error("Error loading documents:", error)
        setDocuments([])
        setFilteredDocuments([])
      }
    }

    loadDocuments()
  }, [selectedChildId, selectedFolder, searchTerm, activeFilters, sortBy, documents])

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
        aiSummary: "Document summary will be available shortly...",
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
        "Dr. Martinez said Emma's doing great with her physical therapy. She wants us to keep doing the exercises at home, especially the balance ones. Next appointment is in 3 weeks.",
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
      name: `Visit Notes - ${new Date().toLocaleDateString()}`,
      type: "text/plain",
      size: voiceNote.length,
      uploadDate: new Date().toISOString(),
      category: "other",
      folder: "other",
      childId: selectedChildId,
      favorite: false,
      tags: ["visit-notes", "doctor"],
      content: voiceNote,
      aiSummary: "Notes from doctor visit",
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
    localStorage.setItem("caregene-documents", JSON.JSON.stringify(updatedDocs))
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
    setSelectedDocument({ ...selectedDocument, tags: updatedTags })
    setNewTag("")
  }

  const removeTagFromDocument = (tagToRemove: string) => {
    if (!selectedDocument) return

    const updatedTags = selectedDocument.tags.filter((tag) => tag !== tagToRemove)
    const updatedDocs = documents.map((doc) => (doc.id === selectedDocument.id ? { ...doc, tags: updatedTags } : doc))
    // </CHANGE> Fixed JSON.JSON.stringify to JSON.stringify
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setSelectedDocument({ ...selectedDocument, tags: updatedTags })
  }

  const saveDocumentNote = () => {
    if (!selectedDocument) return

    const updatedDocs = documents.map((doc) => (doc.id === selectedDocument.id ? { ...doc, notes: documentNote } : doc))
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
    setSelectedDocument({ ...selectedDocument, notes: documentNote })
    setShowAddNote(false)
    setDocumentNote("")
  }

  const viewDocumentDetails = (doc: Document) => {
    setSelectedDocument(doc)
    setShowDocumentDetails(true)
  }

  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== docId)
    localStorage.setItem("caregene-documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
  }

  const folderCounts = folders.map((folder) => ({
    ...folder,
    count:
      folder.id === "all"
        ? filteredDocuments.length
        : filteredDocuments.filter((doc) => doc.folder === folder.id).length,
  }))

  const totalDocuments = documents.filter((doc) => (selectedChildId ? doc.childId === selectedChildId : true)).length

  const recentDocuments = documents
    .filter((doc) => (selectedChildId ? doc.childId === selectedChildId : true))
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 3)

  const unfiledCount = documents.filter(
    (doc) => (selectedChildId ? doc.childId === selectedChildId : true) && (!doc.folder || doc.folder === "other"),
  ).length

  const needsReviewCount = documents.filter(
    (doc) => (selectedChildId ? doc.childId === selectedChildId : true) && doc.tags?.includes("needs-review"),
  ).length

  const readyForVisitCount = documents.filter(
    (doc) => (selectedChildId ? doc.childId === selectedChildId : true) && doc.tags?.includes("visit-ready"),
  ).length

  const [isRightWorkbenchOpen, setIsRightWorkbenchOpen] = useState(true)
  const [isMobileFoldersOpen, setIsMobileFoldersOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // lg breakpoint
        setIsRightWorkbenchOpen(false)
      } else {
        setIsRightWorkbenchOpen(true)
      }
    }

    handleResize() // Set initial state
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const selectDocumentForWorkbench = (doc: Document) => {
    setWorkbenchSelectedDoc(doc)
  }

  const suggestedTags = [
    "Lab Results",
    "Prescription",
    "Report",
    "Urgent",
    "Follow-up",
    "Insurance",
    "School",
    "Therapy",
    "Vaccination",
    "Allergy",
    "Emergency",
    "Routine",
    "Specialist",
    "Primary Care",
  ]

  // Added function to open the document viewer
  const openDocumentViewer = (doc: Document) => {
    setViewerDocument(doc)
    setShowDocumentViewer(true)
  }

  // Added function for sharing documents
  const handleShareDocument = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "shared@example.com", // This would come from a form
          permission: "view",
          expiresIn: 7,
        }),
      })

      if (response.ok) {
        const { shareUrl } = await response.json()
        console.log("Document shared:", shareUrl)
        // Show success message or copy to clipboard
      }
    } catch (error) {
      console.error("Error sharing document:", error)
    }
  }

  return (
    <PageWrapper showChildSelector={true}>
      <div className="min-h-screen bg-background" id="dochub">
        {/* Document Workspace Hero Band */}
        <div className="px-3 sm:px-6 lg:px-8 xl:px-12 py-2">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm rounded-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                {/* Left side - Title, subtitle, and buttons */}
                <div className="flex-1 w-full">
                  <div className="mb-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">DocHub</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                      A smart workspace for medical documents
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-blue-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Smart AI extraction</span>
                      </div>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <svg
                            className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Visit-ready packets</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      size="default"
                      className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 text-white text-sm sm:text-base"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!selectedChildId}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setShowVoiceScribe(true)}
                      disabled={!selectedChildId}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 text-sm sm:text-base"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Quick Note
                    </Button>
                  </div>
                </div>

                {/* Right side - KPI chips - Made responsive and mobile-friendly */}
                <div className="w-full lg:w-auto">
                  <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="grid grid-cols-4 gap-2 sm:gap-4">
                      {/* Total Documents */}
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                          {documents.filter((doc) => (selectedChildId ? doc.childId === selectedChildId : true)).length}
                        </div>
                        <div className="text-xs font-medium text-gray-600">Total</div>
                      </div>

                      {/* Important Documents */}
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">
                          {
                            documents.filter(
                              (doc) => (selectedChildId ? doc.childId === selectedChildId : true) && doc.isImportant,
                            ).length
                          }
                        </div>
                        <div className="text-xs font-medium text-blue-600">Important</div>
                      </div>

                      {/* Tagged Documents */}
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                          {
                            documents.filter(
                              (doc) =>
                                (selectedChildId ? doc.childId === selectedChildId : true) &&
                                doc.tags &&
                                doc.tags.length > 0,
                            ).length
                          }
                        </div>
                        <div className="text-xs font-medium text-gray-600">Tagged</div>
                      </div>

                      {/* This Week */}
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                          {
                            documents.filter((doc) => {
                              if (selectedChildId && doc.childId !== selectedChildId) return false
                              const docDate = new Date(doc.uploadDate)
                              const weekAgo = new Date()
                              weekAgo.setDate(weekAgo.getDate() - 7)
                              return docDate >= weekAgo
                            }).length
                          }
                        </div>
                        <div className="text-xs font-medium text-gray-600">This Week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-3 sm:px-6 lg:px-8 xl:px-12 py-4">
          {/* Search and Filter Controls */}
          <div className="mb-6">
            <div className="lg:hidden mb-4">
              {/* Primary folder selector button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-between h-12 mb-3 bg-muted/30 border-border hover:bg-muted/50"
                onClick={() => setIsMobileFoldersOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5" />
                  <span className="font-medium text-sm sm:text-base">
                    {folderCounts.find((f) => f.id === selectedFolder)?.name || "All Documents"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {folderCounts.find((f) => f.id === selectedFolder)?.count || 0}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {folderCounts.slice(1, 5).map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedFolder === folder.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="truncate text-center leading-tight">{folder.name}</span>
                    {folder.count > 0 && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          selectedFolder === folder.id ? "bg-primary-foreground/20 text-primary-foreground" : ""
                        }`}
                      >
                        {folder.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Search input - full width on mobile */}
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                <Input
                  placeholder="Search by title or content…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-lg text-base bg-background border-border w-full"
                />
              </div>

              {/* Controls row - responsive layout */}
              <div className="flex items-center justify-between gap-4">
                {/* Grid/List segmented control */}
                <div className="flex bg-gray-50/50 p-1 rounded-2xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-50/50 border-gray-200 hover:bg-gray-100/80 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 gap-3 min-w-[140px] justify-between"
                      >
                        <span>
                          {sortBy === "newest" && "Newest First"}
                          {sortBy === "oldest" && "Oldest First"}
                          {sortBy === "name" && "Name A-Z"}
                          {sortBy === "size" && "Size"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[140px]">
                      <DropdownMenuItem
                        onClick={() => setSortBy("newest")}
                        className="flex items-center justify-between"
                      >
                        <span>Newest First</span>
                        {sortBy === "newest" && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("oldest")}
                        className="flex items-center justify-between"
                      >
                        <span>Oldest First</span>
                        {sortBy === "oldest" && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name")} className="flex items-center justify-between">
                        <span>Name A-Z</span>
                        {sortBy === "name" && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("size")} className="flex items-center justify-between">
                        <span>Size</span>
                        {sortBy === "size" && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            {/* Column 1: Compact Folders - Hidden on mobile, shown on lg+ */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-card border border-border rounded-xl shadow-sm h-[600px] overflow-y-auto">
                {/* Folders Section */}
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Folders</h3>

                  <div className="space-y-1">
                    {folderCounts.map((folder) => (
                      <div key={folder.id} className="group flex items-center gap-1">
                        <button
                          onClick={() => setSelectedFolder(folder.id)}
                          className={`flex-1 flex items-center justify-between p-2 rounded-md text-left transition-all text-sm ${
                            selectedFolder === folder.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FolderOpen className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="font-medium truncate text-xs">{folder.name}</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${
                              selectedFolder === folder.id ? "bg-primary-foreground/20 text-primary-foreground" : ""
                            }`}
                          >
                            {folder.count}
                          </Badge>
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
                            className="p-1 h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center gap-2 p-2 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Folder</span>
                  </button>
                </div>

                {/* Smart Folders Section */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Smart Folders</h3>
                  <div className="space-y-1">
                    {[
                      { id: "important", name: "Important", icon: "⭐", count: 0 },
                      { id: "this-month", name: "This Month", icon: "📅", count: 0 },
                      { id: "from-portal", name: "From Portal", icon: "🏥", count: 0 },
                    ].map((smartFolder) => (
                      <button
                        key={smartFolder.id}
                        onClick={() => {
                          setSelectedFolder("all")
                          setSearchTerm("")
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-md text-left transition-all bg-muted/50 hover:bg-muted border-border text-foreground text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm flex-shrink-0">{smartFolder.icon}</span>
                          <span className="font-medium truncate text-xs">{smartFolder.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                          {smartFolder.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2-5: Main Content - Full width on mobile, 4 columns on lg+ */}
            <div className="lg:col-span-4">
              {filteredDocuments.length === 0 ? (
                <Card className="border-dashed border-2 border-border bg-card/50 h-[500px] sm:h-[600px]">
                  <CardContent className="p-6 sm:p-12 text-center flex flex-col justify-center h-full">
                    {/* Illustration */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                      <div className="w-18 h-18 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                      Welcome to {selectedChild.firstName}'s DocHub
                    </h3>
                    <p className="text-muted-foreground mb-8 sm:mb-10 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                      Your smart workspace for organizing and managing medical documents
                    </p>

                    {/* Actions */}
                    <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                      {/* Upload/Scan - Primary Button */}
                      <Button
                        size="lg"
                        className="w-full max-w-sm mx-auto h-12 sm:h-14 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!selectedChildId}
                      >
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                        Upload or Scan Document
                      </Button>

                      {/* Create Folder */}
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full max-w-sm mx-auto h-10 sm:h-12 text-sm sm:text-base border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl bg-transparent"
                      >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Create Folder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    /* Improved responsive grid for documents */
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                      {filteredDocuments.map((doc) => (
                        <Card
                          key={doc.id}
                          className="group hover:shadow-lg transition-all duration-200 border border-border"
                        >
                          <CardContent className="p-4 sm:p-6">
                            {/* Card Header with checkbox and star */}
                            <div className="flex items-start justify-between mb-4">
                              <Checkbox
                                checked={selectedDocuments.includes(doc.id)}
                                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                                className="mt-1"
                              />
                              <button
                                onClick={() => toggleImportant(doc.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  doc.isImportant
                                    ? "text-yellow-500 hover:text-yellow-600"
                                    : "text-gray-300 hover:text-yellow-500"
                                }`}
                              >
                                <Star className={`h-4 w-4 ${doc.isImportant ? "fill-current" : ""}`} />
                              </button>
                            </div>

                            {/* File icon and title */}
                            <div className="flex items-start gap-3 sm:gap-4 mb-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                {getFileTypeIcon(doc.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2">
                                  {doc.name}
                                </h3>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(doc.uploadDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-medium">{doc.source}</p>
                                </div>
                              </div>
                            </div>

                            {/* AI Summary section with distinctive AI border */}
                            {doc.aiSummary && (
                              <div className="mb-4 p-4 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
                                <div className="relative">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <svg
                                        className="h-3 w-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-xs font-bold text-blue-700">AI Summary</span>
                                    <div className="flex gap-1 ml-auto">
                                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                                      <div
                                        className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.2s" }}
                                      ></div>
                                      <div
                                        className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.4s" }}
                                      ></div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-relaxed">{doc.aiSummary}</p>
                                </div>
                              </div>
                            )}

                            {/* comment section */}
                            {doc.notes && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Edit3 className="h-4 w-4 text-gray-600" />
                                  <span className="text-xs font-medium text-gray-700">Your Notes</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{doc.notes}</p>
                              </div>
                            )}

                            {/* Tags */}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {doc.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    +{doc.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-8 w-8 text-muted-foreground hover:text-blue-600"
                                  title="View AI Summary"
                                  onClick={() => {
                                    // Toggle AI summary visibility or show in modal
                                    console.log("View AI Summary for", doc.name)
                                  }}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                  </svg>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-8 w-8 text-muted-foreground hover:text-green-600"
                                  title="Add/Edit Comment"
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setDocumentNote(doc.notes || "")
                                    setShowAddNote(true)
                                  }}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                  title="Preview"
                                  onClick={() => openDocumentViewer(doc)} // Updated to use new viewer
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                  title="Add Tags"
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setShowTagDocument(true)
                                  }}
                                >
                                  <Tag className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                  title="More"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    /* List View - Improved mobile list view */
                    <div className="space-y-2">
                      {filteredDocuments.map((doc) => (
                        <Card
                          key={doc.id}
                          className="group hover:shadow-md transition-all duration-200 border border-border"
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              {/* Checkbox */}
                              <Checkbox
                                checked={selectedDocuments.includes(doc.id)}
                                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                              />

                              {/* File icon */}
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                {getFileTypeIcon(doc.type)}
                              </div>

                              {/* Document info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{doc.name}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                                      <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                      <span className="font-medium">{doc.source}</span>
                                    </div>

                                    {/* AI Summary and notes in list view */}
                                    {doc.aiSummary && (
                                      <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-200">
                                        <div className="flex items-center gap-1 mb-1">
                                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                          <span className="text-xs font-medium text-blue-700">AI Summary</span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2">{doc.aiSummary}</p>
                                      </div>
                                    )}

                                    {doc.notes && (
                                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                        <div className="flex items-center gap-1 mb-1">
                                          <Edit3 className="h-3 w-3 text-gray-600" />
                                          <span className="text-xs font-medium text-gray-700">Notes</span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2">{doc.notes}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Tags and actions - Improved mobile layout */}
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                    {/* Tags */}
                                    {doc.tags && doc.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {doc.tags.slice(0, 2).map((tag, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {doc.tags.length > 2 && (
                                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                            +{doc.tags.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex items-center gap-1">
                                      {/* Important star */}
                                      <button
                                        onClick={() => toggleImportant(doc.id)}
                                        className={`p-1 rounded-full transition-colors ${
                                          doc.isImportant
                                            ? "text-yellow-500 hover:text-yellow-600"
                                            : "text-gray-300 hover:text-yellow-500"
                                        }`}
                                      >
                                        <Star className={`h-4 w-4 ${doc.isImportant ? "fill-current" : ""}`} />
                                      </button>

                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-2 h-8 w-8 text-muted-foreground hover:text-blue-600"
                                          title="View AI Summary"
                                        >
                                          <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                          </svg>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-2 h-8 w-8 text-muted-foreground hover:text-green-600"
                                          title="Add/Edit Comment"
                                          onClick={() => {
                                            setSelectedDocument(doc)
                                            setDocumentNote(doc.notes || "")
                                            setShowAddNote(true)
                                          }}
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                          title="Preview"
                                          onClick={() => openDocumentViewer(doc)} // Updated to use new viewer
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                          title="Tag"
                                          onClick={() => {
                                            setSelectedDocument(doc)
                                            setShowTagDocument(true)
                                          }}
                                        >
                                          <Tag className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && selectedChildId && (
          <div className="px-3 sm:px-6 py-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <DocumentAnalytics documents={documents} selectedChildId={selectedChildId} />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {showTagDocument && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add Tags & Notes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowTagDocument(false)
                    setSelectedDocument(null)
                    setNewTag("")
                    setDocumentNote("")
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 truncate">{selectedDocument.name}</p>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {tag}
                        <button className="ml-1 hover:text-destructive" onClick={() => removeTagFromDocument(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new tag"
                        className="flex-1"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTagToDocument()
                          }
                        }}
                      />
                      <Button size="sm" onClick={addTagToDocument} disabled={!newTag.trim()}>
                        Add
                      </Button>
                    </div>

                    {/* Quick tag suggestions */}
                    <div className="flex flex-wrap gap-1">
                      {suggestedTags
                        .filter(
                          (tag) =>
                            !selectedDocument.tags.includes(tag) &&
                            (newTag === "" || tag.toLowerCase().includes(newTag.toLowerCase())),
                        )
                        .slice(0, 8)
                        .map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setNewTag(tag)
                              setTimeout(() => addTagToDocument(), 0)
                            }}
                            className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Notes</label>
                  <Textarea
                    placeholder="Add your notes about this document..."
                    value={documentNote || selectedDocument.notes || ""}
                    onChange={(e) => setDocumentNote(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  {/* Note templates */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      "Discussed with doctor",
                      "Need to follow up",
                      "Bring to next appointment",
                      "Important for specialist",
                      "Insurance approved",
                    ].map((template) => (
                      <button
                        key={template}
                        onClick={() => {
                          const currentNote = documentNote || selectedDocument.notes || ""
                          const newNote = currentNote ? `${currentNote}\n${template}` : template
                          setDocumentNote(newNote)
                        }}
                        className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                      >
                        + {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTagDocument(false)
                      setSelectedDocument(null)
                      setNewTag("")
                      setDocumentNote("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      saveDocumentNote()
                      setShowTagDocument(false)
                      setSelectedDocument(null)
                      setNewTag("")
                      setDocumentNote("")
                    }}
                    className="flex-1"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddNote && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add Comment</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddNote(false)
                    setSelectedDocument(null)
                    setDocumentNote("")
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 truncate">{selectedDocument.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Comment</label>
                  <Textarea
                    placeholder="Add your thoughts, notes, or reminders about this document..."
                    value={documentNote}
                    onChange={(e) => setDocumentNote(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddNote(false)
                      setSelectedDocument(null)
                      setDocumentNote("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      saveDocumentNote()
                      setShowAddNote(false)
                      setSelectedDocument(null)
                      setDocumentNote("")
                    }}
                    className="flex-1"
                  >
                    Save Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DocumentViewerModal
          document={viewerDocument}
          isOpen={showDocumentViewer}
          onClose={() => {
            setShowDocumentViewer(false)
            setViewerDocument(null)
          }}
          onShare={handleShareDocument}
        />
      </div>
    </PageWrapper>
  )
}
