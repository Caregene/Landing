"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, Plus, Pin, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { TrackerFormModal } from "@/components/tracker-form-modal"
import { symptomStorage } from "@/lib/log-track/symptomStorage"
import { nutritionStorage } from "@/lib/log-track/nutritionStorage"
import { medicationStorage } from "@/lib/log-track/medicationStorage"

export default function TrackerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const trackerType = params.type as "symptom" | "nutrition" | "medication"

  const [searchQuery, setSearchQuery] = useState("")
  const [showTrackerForm, setShowTrackerForm] = useState(false)
  const [selectedTrackerOption, setSelectedTrackerOption] = useState<string | null>(null)
  const [customOptions, setCustomOptions] = useState<any>({
    symptom: [],
    nutrition: [],
    medication: [],
  })
  const [pinnedItems, setPinnedItems] = useState<any>({
    symptom: [],
    nutrition: [],
    medication: [],
  })
  const [showAddNewForm, setShowAddNewForm] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])

  useEffect(() => {
    // Load custom options from localStorage
    const loadCustomOptions = () => {
      try {
        const storageKey = `caregene-custom-${trackerType}`
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          setCustomOptions((prev) => ({
            ...prev,
            [trackerType]: JSON.parse(saved),
          }))
        }
      } catch (error) {
        console.error("Error loading custom options:", error)
      }
    }

    // Load pinned items from localStorage
    const loadPinnedItems = () => {
      try {
        const storageKey = `caregene-pinned-${trackerType}`
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          setPinnedItems((prev) => ({
            ...prev,
            [trackerType]: JSON.parse(saved),
          }))
        }
      } catch (error) {
        console.error("Error loading pinned items:", error)
      }
    }

    loadCustomOptions()
    loadPinnedItems()
  }, [trackerType])

  const defaultOptions = {
    symptom: [
      { name: "Seizure", emoji: "🚨" },
      { name: "Sleep", emoji: "🥱" },
      { name: "GI", emoji: "🤢" },
      { name: "Pain/Discomfort", emoji: "😣" },
      { name: "Sensory/Autonomic", emoji: "✨" },
      { name: "Respiratory/ENT", emoji: "🫁" },
      { name: "Behavior Episode", emoji: "😤" },
      { name: "Motor", emoji: "🏃" },
      { name: "Cognitive", emoji: "🧠" },
      { name: "Mood", emoji: "😊" },
      { name: "Speech", emoji: "🗣️" },
    ],
    nutrition: [
      { name: "Breakfast", emoji: "🌅" },
      { name: "Lunch", emoji: "🌞" },
      { name: "Dinner", emoji: "🌙" },
      { name: "Snack", emoji: "🍎" },
      { name: "Water Intake", emoji: "💧" },
      { name: "Supplements", emoji: "💊" },
    ],
    medication: [
      { name: "Daily Medication", emoji: "💊" },
      { name: "As Needed", emoji: "🆘" },
      { name: "Seizure Medication", emoji: "🚨" },
      { name: "Pain Relief", emoji: "🩹" },
      { name: "Vitamins", emoji: "🌟" },
      { name: "Antibiotics", emoji: "🦠" },
    ],
  }

  const getAllOptions = () => {
    return [...defaultOptions[trackerType], ...customOptions[trackerType]]
  }

  const getFilteredOptions = () => {
    const allOptions = getAllOptions()
    if (!searchQuery.trim()) return allOptions

    return allOptions.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const getPinnedOptions = () => {
    return pinnedItems[trackerType] || []
  }

  const getUnpinnedOptions = () => {
    const pinned = getPinnedOptions()
    const pinnedIds = pinned.map((item) => item.name)
    return getFilteredOptions().filter((option) => !pinnedIds.includes(option.name))
  }

  const togglePin = (item: any) => {
    setPinnedItems((prev) => {
      const categoryPinned = prev[trackerType] || []
      const isCurrentlyPinned = categoryPinned.some((pinned) => pinned.name === item.name)

      if (isCurrentlyPinned) {
        return {
          ...prev,
          [trackerType]: categoryPinned.filter((pinned) => pinned.name !== item.name),
        }
      } else {
        return {
          ...prev,
          [trackerType]: [...categoryPinned, item],
        }
      }
    })

    // Persist to localStorage
    const storageKey = `caregene-pinned-${trackerType}`
    const currentPinned = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const isCurrentlyPinned = currentPinned.some((pinned) => pinned.name === item.name)

    if (isCurrentlyPinned) {
      localStorage.setItem(storageKey, JSON.stringify(currentPinned.filter((pinned) => pinned.name !== item.name)))
    } else {
      localStorage.setItem(storageKey, JSON.stringify([...currentPinned, item]))
    }
  }

  const isPinned = (item: any) => {
    return pinnedItems[trackerType]?.some((pinned) => pinned.name === item.name) || false
  }

  const handleOptionClick = (option: string) => {
    setSelectedTrackerOption(option)
    setShowTrackerForm(true)
  }

  const handleTrackerSave = (entryData: any) => {
    // Ensure client-side execution
    if (typeof window === "undefined") return

    if (trackerType === "symptom") {
      console.log("[tracker] Submitting symptom entry via symptomStorage.add")
      try {
        symptomStorage.add(entryData)
      } catch (e) {
        console.error("[tracker] Failed to submit symptom entry", e)
      }
    } else if (trackerType === "nutrition") {
      console.log("[tracker] Submitting nutrition entry via nutritionStorage.add")
      try {
        nutritionStorage.add(entryData)
      } catch (e) {
        console.error("[tracker] Failed to submit nutrition entry", e)
      }
    } else if (trackerType === "medication") {
      console.log("[tracker] Submitting medication entry via medicationStorage.add")
      try {
        medicationStorage.add(entryData)
      } catch (e) {
        console.error("[tracker] Failed to submit medication entry", e)
      }
    } else {
      const storageKey = `caregene-${trackerType}-entries`
      const existingEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
      localStorage.setItem(storageKey, JSON.stringify([...existingEntries, entryData]))
      console.log(`[tracker] Saved ${trackerType} entry locally`, entryData)
    }

    setShowTrackerForm(false)
    setSelectedTrackerOption(null)
  }

  const getEmojiForItem = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      // Symptoms
      fever: "🤒",
      headache: "🤕",
      nausea: "🤢",
      fatigue: "😴",
      pain: "😣",
      cough: "😷",
      dizziness: "😵",
      anxiety: "😰",
      depression: "😢",
      // Nutrition
      apple: "🍎",
      banana: "🍌",
      water: "💧",
      milk: "🥛",
      bread: "🍞",
      chicken: "🍗",
      fish: "🐟",
      vegetables: "🥬",
      fruit: "🍓",
      // Medication
      pill: "💊",
      tablet: "💊",
      capsule: "💊",
      liquid: "🧪",
      injection: "💉",
      vitamin: "🌟",
      antibiotic: "🦠",
      painkiller: "🩹",
    }

    const lowerName = name.toLowerCase()
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji
    }

    // Default emojis by category
    const defaults = {
      symptom: "🔴",
      nutrition: "🍽️",
      medication: "💊",
    }
    return defaults[trackerType]
  }

  const handleAddNew = () => {
    if (!newItemName.trim()) return

    const newItem = {
      name: newItemName.trim(),
      emoji: getEmojiForItem(newItemName.trim()),
    }

    // Add to custom options
    const updatedCustom = [...customOptions[trackerType], newItem]
    setCustomOptions((prev: any) => ({
      ...prev,
      [trackerType]: updatedCustom,
    }))

    // Save to localStorage
    const storageKey = `caregene-custom-${trackerType}`
    localStorage.setItem(storageKey, JSON.stringify(updatedCustom))

    setNewItemName("")
    setShowAddNewForm(false)
    setSuggestions([])
  }

  const handleInputChange = (value: string) => {
    setNewItemName(value)

    if (value.trim()) {
      const allOptions = getAllOptions()
      const matches = allOptions.filter((option) => option.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (suggestion: any) => {
    handleOptionClick(suggestion.name)
    setNewItemName("")
    setShowAddNewForm(false)
    setSuggestions([])
  }

  const getTypeColor = () => {
    const colors = {
      symptom: "red",
      nutrition: "blue",
      medication: "purple",
    }
    return colors[trackerType]
  }

  const getTypeIcon = () => {
    const icons = {
      symptom: "🚨",
      nutrition: "🍽️",
      medication: "💊",
    }
    return icons[trackerType]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon()}</span>
            <h1 className="text-2xl font-semibold capitalize">{trackerType} Tracker</h1>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push(`/health-plan/tracker/${trackerType}/logs`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Log
        </Button>
      </div>

      {/* Search bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${trackerType} options...`}
            className="h-12 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pinned Items Section */}
      {getPinnedOptions().length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-blue-500" />
            Pinned Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {getPinnedOptions().map((option, index) => (
              <Card
                key={`pinned-${index}`}
                className={`border border-${getTypeColor()}-200 bg-${getTypeColor()}-50/50 hover:bg-${getTypeColor()}-50 transition-colors cursor-pointer relative group`}
                onClick={() => handleOptionClick(option.name)}
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePin(option)
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Pin className="h-3 w-3 text-blue-500 rotate-45" />
                  </button>
                  <div className="text-2xl mb-3">{option.emoji}</div>
                  <span className="text-sm font-medium text-gray-900">{option.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Options */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {searchQuery ? `Search Results` : `All ${trackerType.charAt(0).toUpperCase() + trackerType.slice(1)} Options`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Add New */}
          <Card
            className={`border-2 border-dashed border-${getTypeColor()}-300 bg-${getTypeColor()}-50/30 hover:bg-${getTypeColor()}-50/50 transition-colors cursor-pointer`}
            onClick={() => setShowAddNewForm(true)}
          >
            <CardContent className="flex flex-col items-center text-center p-6">
              <Plus className={`h-8 w-8 text-${getTypeColor()}-500 mb-3`} />
              <span className={`text-sm font-medium text-${getTypeColor()}-600`}>Add New</span>
            </CardContent>
          </Card>

          {getUnpinnedOptions().map((option, index) => (
            <Card
              key={index}
              className="border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer relative group"
              onClick={() => handleOptionClick(option.name)}
            >
              <CardContent className="flex flex-col items-center text-center p-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePin(option)
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Pin className="h-3 w-3 text-gray-400 hover:text-blue-500" />
                </button>
                <div className="text-2xl mb-3">{option.emoji}</div>
                <span className="text-sm font-medium text-gray-900">{option.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add New Form Modal */}
      {showAddNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Add New {trackerType.charAt(0).toUpperCase() + trackerType.slice(1)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddNewForm(false)
                  setNewItemName("")
                  setSuggestions([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder={`Enter ${trackerType} name...`}
                  value={newItemName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNew()
                  }}
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <span>{suggestion.emoji}</span>
                        <span>{suggestion.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddNew} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Add {trackerType.charAt(0).toUpperCase() + trackerType.slice(1)}
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    setShowAddNewForm(false)
                    setNewItemName("")
                    setSuggestions([])
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracker Form Modal */}
      <TrackerFormModal
        isOpen={showTrackerForm}
        onClose={() => {
          setShowTrackerForm(false)
          setSelectedTrackerOption(null)
        }}
        category={trackerType}
        selectedOption={selectedTrackerOption}
        onSave={handleTrackerSave}
      />
    </div>
  )
}
