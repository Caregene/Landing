"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, ImageIcon, X, Edit2, Trash2, Plus } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  category: "symptom" | "nutrition" | "medication"
  title: string
  description: string
  images: string[]
  createdAt: string
}

export default function HealthJournalTrackerPage() {
  const router = useRouter()
  const [selectedChildId, setSelectedChildId] = useState<string>("")
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [entryTitle, setEntryTitle] = useState("")
  const [entryDescription, setEntryDescription] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: new Date().toISOString(),
      category: "symptom",
      title: "Morning headache",
      description: "Woke up with a mild headache, possibly from not drinking enough water yesterday.",
      images: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      date: new Date().toISOString(),
      category: "nutrition",
      title: "Breakfast",
      description: "Had oatmeal with berries and almond milk. Felt good energy afterwards.",
      images: [],
      createdAt: new Date().toISOString(),
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoryData = {
    symptom: {
      emoji: "🤒",
      title: "Symptoms",
      color: "bg-red-50 text-red-700",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedImages((prev) => [...prev, ...files].slice(0, 3))
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveEntry = () => {
    if (!entryTitle.trim() || !entryDescription.trim()) return

    const newEntry: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      date: new Date().toISOString(),
      category: "symptom",
      title: entryTitle,
      description: entryDescription,
      images: selectedImages.map((file) => URL.createObjectURL(file)),
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    }

    if (editingEntry) {
      setEntries((prev) => prev.map((entry) => (entry.id === editingEntry.id ? newEntry : entry)))
    } else {
      setEntries((prev) => [newEntry, ...prev])
    }

    handleCancelEntry()
  }

  const handleCancelEntry = () => {
    setShowNewEntry(false)
    setEditingEntry(null)
    setEntryTitle("")
    setEntryDescription("")
    setSelectedImages([])
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setEntryTitle(entry.title)
    setEntryDescription(entry.description)
    setSelectedImages([])
    setShowNewEntry(true)
  }

  const handleDeleteEntry = (entryId: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    }
  }

  const filteredEntries = entries.filter((entry) => entry.category === "symptom")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={setSelectedChildId}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Symptom Log</h1>
              <p className="text-gray-600 text-base">Track symptoms and health events</p>
            </div>
          </div>

          {/* Add New Entry Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowNewEntry(true)}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Symptom Entry
            </Button>
          </div>

          {/* New/Edit Entry Form */}
          {showNewEntry && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{editingEntry ? "Edit" : "New"} Symptom Entry</h3>
                <Button variant="ghost" size="sm" onClick={handleCancelEntry}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Title</label>
                  <input
                    type="text"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                    placeholder="Enter symptom title..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                  <textarea
                    value={entryDescription}
                    onChange={(e) => setEntryDescription(e.target.value)}
                    placeholder="Describe the symptom details..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base leading-relaxed"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Add Photos (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-base text-gray-600 mb-2">
                        Drag photos here or{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 underline font-medium"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-gray-500">Up to 3 images</p>
                    </div>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="flex gap-3 mt-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!entryTitle.trim() || !entryDescription.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base font-medium"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={handleCancelEntry} className="px-6 py-3 text-base bg-transparent">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-6">🤒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No symptom entries yet</h3>
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  Start tracking your symptom information to build your health journal.
                </p>
                <Button
                  onClick={() => setShowNewEntry(true)}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 text-base font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Entry
                </Button>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">🤒</span>
                        <h3 className="font-semibold text-gray-900 text-lg">{entry.title}</h3>
                        <span className="text-sm text-gray-500 font-medium">{formatDate(entry.date)}</span>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{entry.description}</p>
                      {entry.images.length > 0 && (
                        <div className="flex gap-3 mt-4">
                          {entry.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Entry image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEntry(entry)}
                        className="hover:bg-gray-100 p-2"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="hover:bg-red-50 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
