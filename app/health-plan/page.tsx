"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Plus,
  CheckCircle,
  Calendar,
  Heart,
  MessageCircle,
  Brain,
  Zap,
  Lightbulb,
  TrendingUp,
  Baby,
  Users,
  Phone,
  Star,
  Pill,
  Edit,
  BarChart3,
  ShoppingCart,
  Trophy,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/page-wrapper"
import { DonutChart } from "@/components/ui/donut-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { Target, CheckSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import TrackerLogView from "@/components/tracker-log-view"

export default function HealthPlanPage() {
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false)
  const [showAllTasks, setShowAllTasks] = useState(false)
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

  const [activeTab, setActiveTab] = useState("overview")
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddNewForm, setShowAddNewForm] = useState(false)
  const [newOptionName, setNewOptionName] = useState("")
  const [customOptions, setCustomOptions] = useState<{ [key: string]: Array<{ name: string; emoji: string }> }>({
    symptom: [],
    nutrition: [],
    medication: [],
  })
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [pinnedItems, setPinnedItems] = useState<Record<string, any[]>>({
    symptom: [],
    nutrition: [],
    medication: [],
  })
  const [customItems, setCustomItems] = useState<Record<string, any[]>>({
    symptom: [],
    nutrition: [],
    medication: [],
  })

  const [flows, setFlows] = useState(() => ({
    symptom: {
      currentStep: 1,
      selectedItem: null,
      data: {
        startTime: new Date().toISOString().slice(0, 16),
        duration: "",
        ongoing: false,
        severity: 3,
        context: [],
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
    nutrition: {
      currentStep: 1,
      selectedItem: null,
      data: {
        foods: "",
        portionSize: "",
        time: new Date().toISOString().slice(0, 16),
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
    medication: {
      currentStep: 1,
      selectedItem: null,
      data: {
        medicationName: "",
        doseTaken: "",
        time: new Date().toISOString().slice(0, 16),
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
  }))

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [goalForm, setGoalForm] = useState({
    title: "",
    owner: "",
    target: "",
    milestones: ["", ""],
  })

  const [goals, setGoals] = useState([
    {
      title: "Reduce ER visits to 0 in 6 months",
      owner: "Dr. Patel",
      target: "Mar 2025",
      progress: 75,
      trend: "up",
      status: "on-track",
      milestones: [
        { id: "er1", text: "Schedule follow-up with pulmonologist", completed: false },
        { id: "er2", text: "Review emergency action plan", completed: false },
      ],
    },
    {
      title: "Improve school attendance to 95%",
      owner: "Care Team",
      target: "Dec 2024",
      progress: 82,
      trend: "up",
      status: "on-track",
      milestones: [
        { id: "school1", text: "Meet with school nurse", completed: false },
        { id: "school2", text: "Implement morning routine", completed: false },
      ],
    },
    {
      title: "Master inhaler technique",
      owner: "Respiratory Therapist",
      target: "Nov 2024",
      progress: 60,
      trend: "steady",
      status: "at-risk",
      milestones: [
        { id: "inhaler1", text: "Demonstrate correct inhaler use", completed: false },
        { id: "inhaler2", text: "Practice with spacer", completed: false },
      ],
    },
    {
      title: "Develop better sleep routine",
      owner: "Sleep Specialist",
      target: "Jan 2025",
      progress: 30,
      trend: "down",
      status: "off-track",
      milestones: [
        { id: "sleep1", text: "Establish bedtime routine", completed: false },
        { id: "sleep2", text: "Limit screen time before bed", completed: false },
      ],
    },
    {
      title: "Increase physical activity",
      owner: "Physical Therapist",
      target: "Feb 2025",
      progress: 45,
      trend: "steady",
      status: "at-risk",
      milestones: [
        { id: "activity1", text: "Go for a 20-minute walk", completed: false },
        { id: "activity2", text: "Join a sports team", completed: false },
      ],
    },
  ])

  const [milestoneGoals, setMilestoneGoals] = useState(goals)
  const [showAllGoals, setShowAllGoals] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    role: "",
    specialty: "",
    phone: "",
    email: "",
  })
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [showPracticeLog, setShowPracticeLog] = useState(false)
  const [practiceEntries, setPracticeEntries] = useState([
    {
      id: "1",
      date: new Date(),
      activity: "Two-word phrases practice",
      description: "Practiced 'more milk', 'big ball', 'go car'",
      duration: "15 minutes",
      success: "good",
      notes: "Ava responded well to visual cues",
    },
  ])

  const [showQuickActions, setShowQuickActions] = useState(false)

  const [showScheduleActivity, setShowScheduleActivity] = useState(false)
  const [activityFormData, setActivityFormData] = useState({
    type: "",
    title: "",
    date: "",
    time: "",
    duration: "30",
    location: "",
    notes: "",
    reminders: {
      push24h: true,
      push1h: false,
    },
  })

  const router = useRouter()

  const [editingMember, setEditingMember] = useState<any>(null)
  const [showEditMember, setShowEditMember] = useState(false)

  const handleAddGoal = () => {
    setGoalForm({
      title: "",
      owner: "",
      target: "",
      milestones: ["", ""],
    })
    setIsAddGoalModalOpen(true)
  }

  const handleEditGoal = (goal, index) => {
    setEditingGoal(index)
    setGoalForm({
      title: goal.title,
      owner: goal.owner,
      target: goal.target,
      milestones: goal.milestones.map((m) => m.text),
    })
    setIsEditGoalModalOpen(true)
  }

  const handleSaveGoal = () => {
    const newGoal = {
      title: goalForm.title,
      owner: goalForm.owner,
      target: goalForm.target,
      progress: 0,
      trend: "steady",
      status: "on-track",
      milestones: goalForm.milestones
        .filter((m) => m.trim())
        .map((text, index) => ({
          id: `milestone_${Date.now()}_${index}`,
          text,
          completed: false,
        })),
    }

    if (editingGoal !== null) {
      // Update existing goal
      goals[editingGoal] = { ...goals[editingGoal], ...newGoal }
    } else {
      // Add new goal
      goals.push(newGoal)
    }

    setIsAddGoalModalOpen(false)
    setIsEditGoalModalOpen(false)
    setEditingGoal(null)
  }

  const handleMilestoneChange = (index, value) => {
    const newMilestones = [...goalForm.milestones]
    newMilestones[index] = value
    setGoalForm({ ...goalForm, milestones: newMilestones })
  }

  const addMilestone = () => {
    setGoalForm({ ...goalForm, milestones: [...goalForm.milestones, ""] })
  }

  const removeMilestone = (index) => {
    const newMilestones = goalForm.milestones.filter((_, i) => i !== index)
    setGoalForm({ ...goalForm, milestones: newMilestones })
  }

  const trackingCategories = [
    {
      id: "symptom",
      title: "Symptom",
      description: "Log symptoms and severity",
      icon: BarChart3,
      iconBg: "bg-red-500",
    },
    {
      id: "nutrition",
      title: "Nutrition",
      description: "Track meals and food intake",
      icon: ShoppingCart,
      iconBg: "bg-blue-500",
    },
    {
      id: "medication",
      title: "Medication",
      description: "Record medication taken",
      icon: Pill,
      iconBg: "bg-purple-500",
    },
  ]

  const typeData = {
    symptom: [
      { id: "seizure", name: "Seizure", icon: "🚨" },
      { id: "sleep", name: "Sleep", icon: "😴" },
      { id: "gi", name: "GI", icon: "🤢" },
      { id: "pain", name: "Pain/Discomfort", icon: "😣" },
      { id: "sensory", name: "Sensory/Autonomic", icon: "🌟" },
      { id: "respiratory", name: "Respiratory/ENT", icon: "🫁" },
      { id: "behavior", name: "Behavior Episode", icon: "😤" },
      { id: "motor", name: "Motor", icon: "🏃‍♂️" },
      { id: "cognitive", name: "Cognitive", icon: "🧠" },
      { id: "mood", name: "Mood", icon: "😊" },
      { id: "speech", name: "Speech", icon: "🗣️" },
    ],
    nutrition: [
      { id: "breakfast", name: "Breakfast", icon: "🥞" },
      { id: "lunch", name: "Lunch", icon: "🥪" },
      { id: "dinner", name: "Dinner", icon: "🍽️" },
      { id: "snack", name: "Snack", icon: "🍿" },
      { id: "water", name: "Water", icon: "💧" },
      { id: "supplements", name: "Supplements", icon: "🌿" },
    ],
    medication: [
      { id: "morning", name: "Morning Dose", icon: "🌅" },
      { id: "afternoon", name: "Afternoon Dose", icon: "☀️" },
      { id: "evening", name: "Evening Dose", icon: "🌇" },
      { id: "night", name: "Night Dose", icon: "🌙" },
      { id: "asneeded", name: "As Needed", icon: "🆘" },
    ],
  }

  const contextOptions = ["At home", "At school", "During sleep", "After eating", "During exercise", "Stressed"]

  const todaysTasks = [
    { id: "inhaler", title: "Daily inhaler (Albuterol)", time: "8:00 AM", completed: false },
    { id: "breathing", title: "15 min breathing exercises", time: "After school", completed: false },
    { id: "peak-flow", title: "Peak flow measurement", time: "Evening", completed: false },
  ]

  const medications = [
    { name: "Albuterol", dose: "90 mcg", time: "Next: 2:00 PM", adherence: 95 },
    { name: "Fluticasone", dose: "110 mcg", time: "Next: 8:00 PM", adherence: 88 },
  ]

  const careTeam = [
    {
      id: 1,
      name: "Dr. Patel",
      role: "Pulmonologist",
      specialty: "Pulmonology",
      avatar: "/professional-female-doctor.png",
      phone: "(555) 123-4567",
      email: "dr.patel@hospital.com",
      nextAppointment: "2024-09-10T15:00:00",
    },
  ]

  const appointments = [
    {
      id: 1,
      providerId: 1,
      providerName: "Dr. Patel",
      providerRole: "Pulmonologist",
      date: "2024-09-10T15:00:00",
      location: "Telehealth",
      type: "telehealth",
      status: "confirmed",
    },
    {
      id: 2,
      providerId: 2,
      providerName: "Emma Thompson",
      providerRole: "Respiratory Therapist",
      date: "2024-09-12T10:00:00",
      location: "Therapy Center - Room 204",
      type: "in-person",
      status: "confirmed",
    },
  ]

  const patientInfo = {
    name: "Alex Johnson",
    age: 12,
    avatar: "/placeholder.svg?height=32&width=32",
    conditions: ["Asthma", "Allergies"],
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case "on-track":
        return { icon: "✅", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" }
      case "at-risk":
        return { icon: "⚠️", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" }
      case "off-track":
        return { icon: "❌", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" }
      default:
        return { icon: "⚪", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" }
    }
  }

  const completedTasksCount = todaysTasks.filter((task) => completedTasks.includes(task.id)).length
  const remainingTasks = todaysTasks.length - completedTasksCount

  const isMobile = useIsMobile()

  const handleContinueMilestoneChecklist = () => {
    router.push(`/milestone/checklist/${selectedChild.id}/2y`)
  }

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((taskId) => taskId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const resetFlow = (category) => {
    const defaultFlows = {
      symptom: {
        currentStep: 1,
        selectedItem: null,
        data: {
          startTime: new Date().toISOString().slice(0, 16),
          duration: "",
          ongoing: false,
          severity: 3,
          context: [],
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
      nutrition: {
        currentStep: 1,
        selectedItem: null,
        data: {
          foods: "",
          portionSize: "",
          time: new Date().toISOString().slice(0, 16),
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
      medication: {
        currentStep: 1,
        selectedItem: null,
        data: {
          medicationName: "",
          doseTaken: "",
          time: new Date().toISOString().slice(0, 16),
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
    }

    updateFlow(category, defaultFlows[category])
  }

  const updateFlow = (category, updates) => {
    setFlows((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }))
  }

  const getCurrentFlow = () => {
    const flow = flows[selectedCategory]
    if (!flow) {
      console.log("[v0] Warning: No flow found for category:", selectedCategory)
      return flows.symptom
    }
    return flow
  }

  const handleMobileCategoryClick = (categoryId) => setSelectedCategory(categoryId)
  const handleSymptomClick = (symptom) => {
    updateFlow("symptom", {
      selectedItem: symptom,
      currentStep: 2,
    })
  }

  const handleNutritionClick = (nutrition) => {
    updateFlow("nutrition", {
      selectedItem: nutrition,
      currentStep: 2,
    })
  }

  const handleMedicationClick = (medication) => {
    updateFlow("medication", {
      selectedItem: medication,
      currentStep: 2,
    })
  }

  const handleVoiceLog = () => {
    setIsListening(!isListening)
  }

  const handleQuickLog = (type: "symptom" | "nutrition" | "medication" | "milestone" | "practice") => {
    if (type === "practice") {
      setShowPracticeLog(true)
    } else {
      router.push("/health-journal-tracker")
    }
  }

  const getEmojiForItem = (itemName: string, category: string): string => {
    const name = itemName.toLowerCase().trim()

    const emojiMap: Record<string, string> = {
      // Symptoms - more expressive emojis
      headache: "🤕",
      fever: "🤒",
      cough: "😷",
      nausea: "🤢",
      vomit: "🤮",
      dizzy: "😵‍💫",
      tired: "😴",
      anxiety: "😰",
      stress: "😫",
      rash: "🔴",
      itch: "🤏",
      swelling: "🫧",
      bruise: "🟣",
      cut: "🩹",
      burn: "🔥",
      cold: "🥶",
      hot: "🥵",
      shiver: "🥶",
      sweat: "💦",
      thirst: "🥤",
      seizure: "🚨",
      pain: "😣",

      // Nutrition - more vibrant food emojis
      apple: "🍎",
      banana: "🍌",
      orange: "🍊",
      grape: "🍇",
      strawberry: "🍓",
      carrot: "🥕",
      broccoli: "🥦",
      spinach: "🥬",
      tomato: "🍅",
      potato: "🥔",
      bread: "🍞",
      rice: "🍚",
      pasta: "🍝",
      pizza: "🍕",
      burger: "🍔",
      chicken: "🍗",
      fish: "🐟",
      beef: "🥩",
      egg: "🥚",
      cheese: "🧀",
      milk: "🥛",
      juice: "🧃",
      coffee: "☕",
      tea: "🍵",
      soda: "🥤",
      cake: "🍰",
      cookie: "🍪",
      chocolate: "🍫",
      candy: "🍬",
      "ice cream": "🍦",
      breakfast: "🥞",
      lunch: "🥪",
      dinner: "🍽️",
      snack: "🍿",

      // Medications - clearer medical emojis
      tylenol: "💊",
      advil: "💊",
      aspirin: "💊",
      ibuprofen: "💊",
      acetaminophen: "💊",
      antibiotic: "💉",
      vitamin: "🌿",
      supplement: "🌿",
      inhaler: "💨",
      drops: "💧",
      cream: "🧴",
      ointment: "🧴",
      gel: "🧴",
      spray: "💨",
      patch: "🩹",
      morning: "🌅",
      afternoon: "☀️",
      evening: "🌇",
      night: "🌙",
    }

    // Check for exact matches first
    if (emojiMap[name]) {
      return emojiMap[name]
    }

    // Check for partial matches
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (name.includes(key) || key.includes(name)) {
        return emoji
      }
    }

    // Category-based fallbacks
    const categoryEmojis: Record<string, string> = {
      symptom: "🩺",
      nutrition: "🥗",
      medication: "💊",
    }

    // Check if emoji would be offensive or inappropriate (basic check)
    const inappropriateTerms = ["pain", "hurt", "sick", "bad", "awful", "terrible"]
    const isInappropriate = inappropriateTerms.some((term) => name.includes(term))

    if (isInappropriate) {
      return itemName.charAt(0).toUpperCase()
    }

    // Return category emoji or first letter
    return categoryEmojis[category] || itemName.charAt(0).toUpperCase()
  }

  const handleManualAdd = () => {
    if (newItemName.trim()) {
      const closestMatch = findClosestMatch(newItemName.trim(), selectedCategory)

      let newItem
      if (closestMatch) {
        // Link with closest existing item
        newItem = {
          id: closestMatch.id,
          name: newItemName.trim(),
          icon: closestMatch.icon,
          linkedTo: closestMatch.name, // Track what it's linked to
        }
      } else {
        // Create new item with first letter or emoji
        const itemIcon = getEmojiForItem(newItemName.trim(), selectedCategory)
        newItem = {
          id: `custom-${Date.now()}`,
          name: newItemName.trim(),
          icon:
            itemIcon === getEmojiForItem("", selectedCategory) ? newItemName.trim().charAt(0).toUpperCase() : itemIcon,
        }
      }

      setCustomItems((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), newItem],
      }))

      const storageKey = `caregene-custom-${selectedCategory}`
      const currentCustom = JSON.parse(localStorage.getItem(storageKey) || "[]")
      localStorage.setItem(storageKey, JSON.stringify([...currentCustom, newItem]))

      setNewItemName("")
      setShowManualAdd(false)

      if (closestMatch) {
        console.log(`[v0] Linked "${newItem.name}" to existing item "${closestMatch.name}"`)
      }
    }
  }

  const addCustomItem = (category, name) => {
    const newItem = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name,
      icon: "ℹ️",
    }

    setCustomItems((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newItem],
    }))

    const storageKey = `caregene-custom-${category}`
    const currentCustom = JSON.parse(localStorage.getItem(storageKey) || "[]")
    localStorage.setItem(storageKey, JSON.stringify([...currentCustom, newItem]))
  }

  const showLoggedEntries = (itemName, category) => {
    window.location.href = `/genetic-tracker/logs?item=${encodeURIComponent(itemName)}&category=${category}`
  }

  const togglePin = (item, category) => {
    setPinnedItems((prev) => {
      const categoryPinned = prev[category] || []
      const isCurrentlyPinned = categoryPinned.some((pinned) => pinned.id === item.id)

      if (isCurrentlyPinned) {
        return {
          ...prev,
          [category]: categoryPinned.filter((pinned) => pinned.id !== item.id),
        }
      } else {
        return {
          ...prev,
          [category]: [...categoryPinned, item],
        }
      }
    })

    const storageKey = `caregene-pinned-${category}`
    const currentPinned = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const isCurrentlyPinned = currentPinned.some((pinned) => pinned.id === item.id)

    if (isCurrentlyPinned) {
      localStorage.setItem(storageKey, JSON.stringify(currentPinned.filter((pinned) => pinned.id !== item.id)))
    } else {
      localStorage.setItem(storageKey, JSON.stringify([...currentPinned, item]))
    }
  }

  const isPinned = (item, category) => {
    return pinnedItems[category]?.some((pinned) => pinned.id === item.id) || false
  }

  const findClosestMatch = (inputName: string, category: string) => {
    const name = inputName.toLowerCase().trim()
    const existingItems = typeData[category] || []

    // Check for exact matches first
    const exactMatch = existingItems.find((item) => item.name.toLowerCase() === name)
    if (exactMatch) return exactMatch

    // Check for partial matches (contains)
    const partialMatch = existingItems.find(
      (item) => item.name.toLowerCase().includes(name) || name.includes(item.name.toLowerCase()),
    )
    if (partialMatch) return partialMatch

    // Check for similar words (first 3 characters match)
    const similarMatch = existingItems.find(
      (item) => item.name.toLowerCase().substring(0, 3) === name.substring(0, 3) && name.length > 2,
    )
    if (similarMatch) return similarMatch

    return null
  }

  const calculateGoalProgress = (goal) => {
    const completedMilestones = goal.milestones.filter((milestone) => milestone.completed).length
    const totalMilestones = goal.milestones.length
    return (completedMilestones / totalMilestones) * 100
  }

  const toggleMilestone = (goalId, milestoneId) => {
    setMilestoneGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                return { ...milestone, completed: !milestone.completed }
              }
              return milestone
            }),
          }
        }
        return goal
      }),
    )
  }

  const handleSymptomInputChange = (field, value) => {
    updateFlow("symptom", {
      data: {
        ...flows.symptom.data,
        [field]: value,
      },
    })
  }

  const handleContextToggle = (context) => {
    const isSelected = flows.symptom.data.context.includes(context)
    updateFlow("symptom", {
      data: {
        ...flows.symptom.data,
        context: isSelected
          ? flows.symptom.data.context.filter((c) => c !== context)
          : [...flows.symptom.data.context, context],
      },
    })
  }

  const handleSaveSymptom = () => {
    // Save the symptom data
    console.log("Saving symptom data:", flows.symptom.data)
    // Reset the flow
    resetFlow("symptom")
    // Go back to the tracker tab
    setActiveTab("overview")
  }

  const handleNutritionInputChange = (value) => {
    updateFlow("nutrition", {
      data: { ...flows.nutrition.data, foods: value },
    })
  }

  const handleSaveNutrition = () => {
    // Save the nutrition data
    console.log("Saving nutrition data:", flows.nutrition.data)
    // Reset the flow
    resetFlow("nutrition")
    // Go back to the tracker tab
    setActiveTab("overview")
  }

  const handleMedicationInputChange = (field, value) => {
    updateFlow("medication", {
      data: {
        ...flows.medication.data,
        [field]: value,
      },
    })
  }

  const handleSaveMedication = () => {
    // Save the medication data
    console.log("Saving medication data:", flows.medication.data)
    // Reset the flow
    resetFlow("medication")
    // Go back to the tracker tab
    setActiveTab("overview")
  }

  const handleScheduleActivity = () => {
    setShowScheduleActivity(true)
  }

  const handleSaveActivity = () => {
    // In a real app, this would save to the database
    console.log("[v0] Saving activity:", activityFormData)

    // Reset form and close modal
    setActivityFormData({
      type: "",
      title: "",
      date: "",
      time: "",
      duration: "30",
      location: "",
      notes: "",
      reminders: {
        push24h: true,
        push1h: false,
      },
    })
    setShowScheduleActivity(false)
  }

  const [newTask, setNewTask] = useState({
    title: "",
    time: "",
    priority: "medium",
  })

  const [editingTask, setEditingTask] = useState(null)
  const [showEditTask, setShowEditTask] = useState(false)

  const handleSaveTask = () => {
    const newTaskWithId = { ...newTask, id: Date.now().toString() }
    todaysTasks.push(newTaskWithId)
    setNewTask({ title: "", time: "", priority: "medium" })
    setShowAddTask(false)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowEditTask(true)
  }

  const handleUpdateTask = () => {
    const updatedTasks = todaysTasks.map((task) => {
      if (task.id === editingTask.id) {
        return { ...editingTask }
      }
      return task
    })
    //setTodaysTasks(updatedTasks);
    setEditingTask(null)
    setShowEditTask(false)
  }

  const [showTrackerLog, setShowTrackerLog] = useState(false)
  const [showTrackerForm, setShowTrackerForm] = useState(false)
  const [selectedTrackerCategory, setSelectedTrackerCategory] = useState<"symptom" | "nutrition" | "medication" | null>(
    null,
  )

  const [showTrackerOptions, setShowTrackerOptions] = useState(false)
  const [selectedTrackerOption, setSelectedTrackerOption] = useState<string | null>(null)

  const [trackerType, setTrackerType] = useState<"symptom" | "nutrition" | "medication" | null>(null)

  const handleTrackerCardClick = (type: "symptom" | "nutrition" | "medication") => {
    router.push(`/health-plan/tracker/${type}`)
  }

  const handleOptionClick = (option: string) => {
    setSelectedTrackerOption(option)
    setShowTrackerForm(true)
  }

  const handleTrackerSave = (entryData: any) => {
    const storageKey = `caregene-${selectedTrackerCategory}-entries`
    const existingEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    localStorage.setItem(storageKey, JSON.stringify([...existingEntries, entryData]))

    // Close modal and switch to tracker tab
    setShowTrackerForm(false)
    setShowTrackerOptions(false)
    setSelectedTrackerCategory(null)
    setSelectedTrackerOption(null)
    setActiveTab("tracker")
  }

  const handleTrackerOptionSelect = (option: string) => {
    setSelectedTrackerOption(option)
    setShowTrackerForm(true)
  }

  const emojiMap: { [key: string]: string } = {
    // Symptoms
    fever: "🤒",
    headache: "🤕",
    nausea: "🤢",
    vomit: "🤮",
    cough: "😷",
    sneeze: "🤧",
    tired: "😴",
    dizzy: "😵",
    pain: "😣",
    ache: "😖",
    rash: "🔴",
    itch: "🐛",
    sweat: "💦",
    cold: "🥶",
    hot: "🥵",
    // Nutrition
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    milk: "🥛",
    water: "💧",
    bread: "🍞",
    rice: "🍚",
    meat: "🥩",
    fish: "🐟",
    egg: "🥚",
    vegetable: "🥬",
    fruit: "🍇",
    cheese: "🧀",
    yogurt: "🥛",
    juice: "🧃",
    // Medications
    pill: "💊",
    tablet: "💊",
    capsule: "💊",
    liquid: "🧪",
    injection: "💉",
    cream: "🧴",
    drops: "💧",
    inhaler: "🫁",
    patch: "🩹",
    vitamin: "🌟",
  }

  const getBestEmoji = (name: string, category: string): string => {
    const lowerName = name.toLowerCase()

    // Check for exact matches first
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) {
        return emoji
      }
    }

    // Category-based fallbacks
    switch (category) {
      case "symptom":
        return "🔴"
      case "nutrition":
        return "🍽️"
      case "medication":
        return "💊"
      default:
        return "📝"
    }
  }

  useEffect(() => {
    const savedOptions = localStorage.getItem("caregene-custom-options")
    if (savedOptions) {
      setCustomOptions(JSON.parse(savedOptions))
    }
  }, [])

  const handleAddNewOption = () => {
    if (!newOptionName.trim() || !trackerType) return

    const emoji = getBestEmoji(newOptionName, trackerType)
    const newOption = { name: newOptionName.trim(), emoji }

    // Check if option already exists
    const existingOptions = getFilteredOptions()
    const exists = existingOptions.some((opt) => opt.name.toLowerCase() === newOptionName.toLowerCase())

    if (exists) {
      alert("This option already exists!")
      return
    }

    const updatedOptions = {
      ...customOptions,
      [trackerType]: [...customOptions[trackerType], newOption],
    }

    setCustomOptions(updatedOptions)
    localStorage.setItem("caregene-custom-options", JSON.stringify(updatedOptions))

    // Clear form and open tracker form with new option
    setNewOptionName("")
    setShowAddNewForm(false)
    handleOptionClick(newOption.name)
  }

  const getAllOptions = () => {
    if (!trackerType) return []

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

    return [...defaultOptions[trackerType], ...customOptions[trackerType]]
  }

  const getFilteredOptions = () => {
    const allOptions = getAllOptions()
    if (!searchQuery.trim()) return allOptions

    return allOptions.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        {/* Patient Header */}
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground"></div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="pb-20">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:relative md:bg-transparent md:border-t-0">
                  <div className="overflow-x-auto scrollbar-hide">
                    <TabsList className="flex w-max bg-transparent h-auto p-1 min-w-full md:justify-center">
                      <TabsTrigger
                        value="overview"
                        className="flex-shrink-0 min-w-[33.33vw] md:min-w-[120px] h-12 px-3 md:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg mx-0.5 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-medium">Overview</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="goals"
                        className="flex-shrink-0 min-w-[33.33vw] md:min-w-[120px] h-12 px-3 md:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg mx-0.5 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-medium">Milestone</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="tracker"
                        className="flex-shrink-0 min-w-[33.33vw] md:min-w-[120px] h-12 px-3 md:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg mx-0.5 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-medium">Log &amp; Track</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="care-team"
                        className="flex-shrink-0 min-w-[33.33vw] md:min-w-[120px] h-12 px-3 md:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg mx-0.5 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-medium">Care Team</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex justify-center pt-1 pb-2 md:hidden">
                      <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <TabsContent value="overview" className="mt-0">
                  {/* Hero Section - Health Overview */}
                  <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm mb-6">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[96px]">
                        <div className="flex-shrink-0">
                          <DonutChart
                            percentage={75}
                            itemsLeft={3}
                            isComplete={false}
                            size="medium"
                            showAnimation={true}
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Health Overview</h2>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 mb-4">
                            3 of 4 daily tasks completed • 95% medication adherence this week
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <Button
                            size="default"
                            className="bg-blue-600 hover:bg-blue-700 px-6 text-white"
                            onClick={() => setActiveTab("tracker")}
                          >
                            Log Health Data
                          </Button>
                          <Button
                            size="default"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 bg-transparent"
                            onClick={() => setActiveTab("goals")}
                          >
                            View Goals
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overview Banner - Compact version */}
                  <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Today's Tasks */}
                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm sm:text-base">Today's Tasks</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {todaysTasks.length === 0 ? (
                            <div className="text-center py-8 px-4">
                              <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                                <CheckSquare className="h-8 w-8 text-blue-500" />
                              </div>
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                                Start with a simple daily routine for Ava's care
                              </p>
                            </div>
                          ) : (
                            <>
                              {(showAllTasks ? todaysTasks : todaysTasks.slice(0, 2)).map((task) => (
                                <div key={task.id} className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={completedTasks.includes(task.id)}
                                    onChange={() => toggleTask(task.id)}
                                    className="rounded border-border"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                                      {task.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{task.time}</p>
                                  </div>
                                </div>
                              ))}
                              {todaysTasks.length > 2 && (
                                <button
                                  onClick={() => setShowAllTasks(!showAllTasks)}
                                  className="text-xs text-primary hover:text-primary/80 font-medium"
                                >
                                  {showAllTasks ? "Show less" : `+${todaysTasks.length - 2} more tasks`}
                                </button>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Medications */}
                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm sm:text-base">Medications</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-foreground">Albuterol 90 mcg</p>
                            <p className="text-xs text-muted-foreground">Next: 2:00 PM</p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleTrackerCardClick("medication")}
                          >
                            Log Dose
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Upcoming */}
                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm sm:text-base">Upcoming</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-foreground">Pulmonology</p>
                            <p className="text-xs text-muted-foreground">Wed Sep 10, 3 PM</p>
                            <Badge
                              variant="secondary"
                              className="text-xs mt-1 bg-muted text-muted-foreground border border-border"
                            >
                              Telehealth
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-border hover:bg-muted bg-transparent"
                            >
                              Join
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-border hover:bg-muted bg-transparent"
                            >
                              Reschedule
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm sm:text-base">Growth Rankings</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Height</span>
                              <span className="text-sm font-medium">65th percentile</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Weight</span>
                              <span className="text-sm font-medium">58th percentile</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Above average for age group</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Overview Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Health Goals</h3>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {goals.length === 0 ? (
                          <div className="text-center py-8 px-4">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                              <Target className="h-8 w-8 text-green-500" />
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-6">
                              Start with a template for Asthma management
                            </p>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                              onClick={handleAddGoal}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Browse Goal Templates
                            </Button>
                          </div>
                        ) : (
                          <>
                            {(showAllGoals ? goals : goals.slice(0, 3)).map((goal, index) => {
                              const statusDisplay = getStatusDisplay(goal.status)
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border-l-4 ${statusDisplay.bgColor} ${statusDisplay.borderColor} transition-all duration-200 hover:shadow-sm`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                      <span className="text-lg leading-none mt-0.5">{statusDisplay.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-xs sm:text-sm text-gray-900 leading-tight mb-1">
                                          {goal.title}
                                        </h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-600">
                                          <span className="flex items-center gap-1">
                                            <span className="font-medium">Owner:</span> {goal.owner}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <span className="font-medium">Due:</span> {goal.target}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-gray-400 hover:text-gray-600"
                                      onClick={() => handleEditGoal(goal, index)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                      <span>Progress</span>
                                      <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-300 ${statusDisplay.progressColor}`}
                                        style={{ width: `${goal.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">Recent Achievements</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">7-Day Streak</p>
                            <p className="text-xs text-yellow-600">Medication adherence</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">Goal Completed</p>
                            <p className="text-xs text-green-600">Daily exercise routine</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-800">Milestone Reached</p>
                            <p className="text-xs text-blue-600">Weight management target</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">Recent Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900 truncate">Milestone Assessment</p>
                                <span className="text-xs text-gray-500">2h ago</span>
                              </div>
                              <p className="text-xs text-gray-600">18-month checklist - 85%</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900 truncate">Medication Logged</p>
                                <span className="text-xs text-gray-500">4h ago</span>
                              </div>
                              <p className="text-xs text-gray-600">Albuterol 90mcg taken</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900 truncate">Appointment Scheduled</p>
                                <span className="text-xs text-gray-500">1d ago</span>
                              </div>
                              <p className="text-xs text-gray-600">Pulmonology follow-up</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">Data Export & Sharing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-medium text-gray-700">Export Options</h4>
                            <div className="grid grid-cols-1 gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs justify-start bg-transparent"
                                onClick={() => console.log("Exporting health summary...")}
                              >
                                <BarChart3 className="h-3 w-3 mr-1.5" />
                                Health Summary (PDF)
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs justify-start bg-transparent"
                                onClick={() => console.log("Exporting milestone data...")}
                              >
                                <Baby className="h-3 w-3 mr-1.5" />
                                Milestone Data (CSV)
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-xs font-medium text-gray-700">Quick Share</h4>
                            <div className="grid grid-cols-1 gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs justify-start bg-transparent"
                                onClick={() => console.log("Sharing with provider...")}
                              >
                                <Users className="h-3 w-3 mr-1.5" />
                                Share with Provider
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs justify-start bg-transparent"
                                onClick={() => console.log("Copying shareable link...")}
                              >
                                <MessageCircle className="h-3 w-3 mr-1.5" />
                                Copy Link
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        Healthcare Provider Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-600 mb-3">
                        Connect with your healthcare providers to automatically share relevant health data before
                        appointments.
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Connect Provider
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4 sm:space-y-6 mt-0">
                  {/* Goals Header */}
                  <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[96px]">
                        <div className="flex-shrink-0">
                          <DonutChart
                            percentage={85}
                            itemsLeft={3}
                            isComplete={false}
                            size="medium"
                            showAnimation={true}
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                              18M Developmental Milestones
                            </h2>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 mb-4">
                            15 of 18 milestones achieved • 3 milestones remaining
                          </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <Button
                            size="default"
                            className="bg-blue-600 hover:bg-blue-700 px-6 flex-1 sm:flex-none text-white"
                            onClick={handleContinueMilestoneChecklist}
                          >
                            Continue Checklist
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestone Categories Progress */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { category: "Social", icon: Heart, progress: 90, completed: 4, total: 5, color: "teal" },
                      {
                        category: "Language",
                        icon: MessageCircle,
                        progress: 75,
                        completed: 3,
                        total: 4,
                        color: "orange",
                      },
                      { category: "Cognitive", icon: Brain, progress: 85, completed: 4, total: 5, color: "blue" },
                      { category: "Movement", icon: Zap, progress: 100, completed: 4, total: 4, color: "green" },
                    ].map((cat) => (
                      <Card
                        key={cat.category}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer border border-border shadow-sm bg-card"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="font-semibold text-gray-900">{cat.category}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {cat.completed}/{cat.total} complete
                              </span>
                              <span className="font-medium text-gray-900">{cat.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-full rounded-full bg-${cat.color}-500 transition-all duration-700`}
                                style={{ width: `${cat.progress}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Smart Suggestions & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="border border-border shadow-sm bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                          <Lightbulb className="h-5 w-5" />
                          Smart Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-4 bg-white rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                              <MessageCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">Practice Two-Word Phrases</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                  Help Ava combine words like "more milk" or "big ball"
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                              <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">Climbing Practice</h4>
                                <p className="text-sm text-gray-600 mb-3">Encourage climbing on playground equipment</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-300 bg-transparent"
                                  onClick={handleScheduleActivity}
                                >
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Schedule Activity
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-border shadow-sm bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <TrendingUp className="h-5 w-5" />
                          Care Insights
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-4 bg-white rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">7-day milestone streak</span>
                            </div>
                            <p className="text-sm text-gray-600">Consistent progress across all categories</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Language development accelerating</span>
                            </div>
                            <p className="text-sm text-gray-600">25% improvement in vocabulary milestones</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Focus area identified</span>
                            </div>
                            <p className="text-sm text-gray-600">Social interaction skills need attention</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tracker" className="space-y-4 sm:space-y-6 mt-0">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">What would you like to log?</h2>
                  </div>

                  {/* Main tracking cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Card
                      className="border-2 border-red-200 bg-red-50/30 hover:bg-red-50/50 transition-colors cursor-pointer"
                      onClick={() => handleTrackerCardClick("symptom")}
                    >
                      <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Symptom</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Log symptoms and severity</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="border-2 border-blue-200 bg-blue-50/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
                      onClick={() => handleTrackerCardClick("nutrition")}
                    >
                      <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nutrition</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Track meals and food intake</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="border-2 border-purple-200 bg-purple-50/30 hover:bg-purple-50/50 transition-colors cursor-pointer"
                      onClick={() => handleTrackerCardClick("medication")}
                    >
                      <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Medication</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Record medication taken</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="care-team" className="mt-0">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Care Team Overview Header */}
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[96px]">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Care Circle</h2>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                              {appointments.length} upcoming appointments • 3 active conversations • 85% care plan
                              completion
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button
                              onClick={() => setShowAddMember(true)}
                              size="default"
                              className="bg-blue-600 hover:bg-blue-700 px-6 text-white"
                            >
                              Add Member
                            </Button>
                            <Button
                              size="default"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent px-6"
                            >
                              Emergency
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Care Team Members */}
                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">Care Team</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            { name: "Dr. Sarah Johnson", role: "Pulmonologist", status: "Available", avatar: "SJ" },
                            { name: "Nurse Emma Wilson", role: "Care Coordinator", status: "Busy", avatar: "EW" },
                            { name: "Dr. Michael Chen", role: "Pediatrician", status: "Available", avatar: "MC" },
                          ].map((member, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{member.avatar}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{member.name}</div>
                                <div className="text-xs text-muted-foreground">{member.role}</div>
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded ${
                                  member.status === "Available"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {member.status}
                              </div>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button size="sm" className="w-full bg-transparent" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Team Member
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Upcoming Appointments */}
                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {appointments.map((appointment, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{appointment.providerName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(appointment.date).toLocaleDateString()} • {appointment.type}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Join
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button size="sm" className="w-full bg-transparent" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Schedule Appointment
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">Caregivers & Contact</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            {
                              name: "Mom - Sarah Miller",
                              role: "Primary Caregiver",
                              phone: "(555) 123-4567",
                              email: "sarah.miller@email.com",
                            },
                            {
                              name: "Dad - John Miller",
                              role: "Secondary Caregiver",
                              phone: "(555) 987-6543",
                              email: "john.miller@email.com",
                            },
                            {
                              name: "Grandma - Betty Johnson",
                              role: "Emergency Contact",
                              phone: "(555) 456-7890",
                              email: "betty.johnson@email.com",
                            },
                          ].map((caregiver, index) => (
                            <div key={index} className="p-3 rounded-lg border">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm">{caregiver.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
                                    {caregiver.role}
                                  </span>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {caregiver.phone}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {caregiver.email}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button size="sm" className="w-full bg-transparent" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Caregiver
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border border-border shadow-sm bg-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">Emergency Contacts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            {
                              name: "Emergency Services",
                              phone: "911",
                              type: "Emergency",
                            },
                            {
                              name: "Children's Hospital",
                              phone: "(555) 234-5678",
                              type: "Hospital",
                            },
                            {
                              name: "Dr. Smith (Neurologist)",
                              phone: "(555) 345-6789",
                              type: "Specialist",
                            },
                          ].map((contact, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-red-50">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm">{contact.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                                    {contact.type}
                                  </span>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </p>
                            </div>
                          ))}
                          <Button size="sm" className="w-full bg-transparent" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Emergency Contact
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {showTrackerLog && <TrackerLogView onClose={() => setShowTrackerLog(false)} />}
      {showAddNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New {trackerType}</h3>
            <Input
              placeholder={`Enter ${trackerType} name...`}
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              className="mb-4"
              onKeyPress={(e) => e.key === "Enter" && handleAddNewOption()}
            />
            <div className="flex gap-3">
              <Button onClick={handleAddNewOption} className="flex-1">
                Add & Log
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNewForm(false)
                  setNewOptionName("")
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
