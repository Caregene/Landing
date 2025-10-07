"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Calendar,
  Heart,
  MessageCircle,
  Brain,
  Zap,
  Lightbulb,
  TrendingUp,
  Users,
  Pill,
  Edit,
  BarChart3,
  ShoppingCart,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DonutChart } from "@/components/ui/donut-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import TrackerLogView from "@/components/tracker-log-view"
import { PageWrapper } from "@/components/page-wrapper"
import { DoubleCircleChart } from "@/components/ui/double-circle-chart"

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

  const [showEditAppointment, setShowEditAppointment] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [appointmentForm, setAppointmentForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "",
    location: "",
    notes: "",
  })

  const [showEditCaregiver, setShowEditCaregiver] = useState(false)
  const [editingCaregiver, setEditingCaregiver] = useState(null)
  const [caregiverForm, setCaregiverForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  })

  const [todaysTasks, setTodaysTasks] = useState([
    { id: "inhaler", title: "Daily inhaler (Albuterol)", time: "8:00 AM", completed: false },
    { id: "breathing", title: "15 min breathing exercises", time: "After school", completed: false },
    { id: "peak-flow", title: "Peak flow measurement", time: "Evening", completed: false },
  ])

  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    time: "",
  })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title.trim(),
        time: newTask.time || "Anytime",
        completed: false,
      }
      setTodaysTasks((prev) => [...prev, task])
      setNewTask({ title: "", time: "" })
      setShowAddTaskDialog(false)
    }
  }

  const handleEditTask = (task: any) => {
    setEditingTask({ ...task })
    setShowEditTaskDialog(true)
  }

  const handleUpdateTask = () => {
    if (editingTask && editingTask.title.trim()) {
      setTodaysTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? { ...editingTask, title: editingTask.title.trim() } : task)),
      )
      setEditingTask(null)
      setShowEditTaskDialog(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTodaysTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const toggleTask = (id: string) => {
    setTodaysTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

    // Remove completed tasks after a short delay for visual feedback
    setTimeout(() => {
      setTodaysTasks((prev) => prev.filter((task) => task.id !== id || !task.completed))
    }, 500)
  }

  const activeTasks = todaysTasks.filter((task) => !task.completed)
  const completedTasksCount = todaysTasks.filter((task) => task.completed).length

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

  // const todaysTasks = [
  //   { id: "inhaler", title: "Daily inhaler (Albuterol)", time: "8:00 AM", completed: false },
  //   { id: "breathing", title: "15 min breathing exercises", time: "After school", completed: false },
  //   { id: "peak-flow", title: "Peak flow measurement", time: "Evening", completed: false },
  // ]

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

  // const completedTasksCount = todaysTasks.filter((task) => completedTasks.includes(task.id)).length
  // const remainingTasks = todaysTasks.length - completedTasksCount

  const isMobile = useIsMobile()

  const handleContinueMilestoneChecklist = () => {
    router.push(`/milestone/checklist/${selectedChild.id}/2y`)
  }

  // const toggleTask = (id: string) => {
  //   setCompletedTasks((prev) => {
  //     if (prev.includes(id)) {
  //       return prev.filter((taskId) => taskId !== id)
  //     } else {
  //       return [...prev, id]
  //     }
  //   })
  // }

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

  const [showPracticeLog, setShowPracticeLog] = useState(false) // Added state for practice log

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

  // const [newTask, setNewTask] = useState({
  //   title: "",
  //   time: "",
  //   priority: "medium",
  // })

  // const [editingTask, setEditingTask] = useState(null)
  // const [showEditTask, setShowEditTask] = useState(false)

  // const handleSaveTask = () => {
  //   const newTaskWithId = { ...newTask, id: Date.now().toString() }
  //   todaysTasks.push(newTaskWithId)
  //   setNewTask({ title: "", time: "", priority: "medium" })
  //   setShowAddTask(false)
  // }

  // const handleEditTask = (task) => {
  //   setEditingTask(task)
  //   setShowEditTask(true)
  // }

  // const handleUpdateTask = () => {
  //   const updatedTasks = todaysTasks.map((task) => {
  //     if (task.id === editingTask.id) {
  //       return { ...editingTask }
  //     }
  //     return task
  //   })
  //   //setTodaysTasks(updatedTasks);
  //   setEditingTask(null)
  //   setShowEditTask(false)
  // }

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

  const handleEditMember = (member: any) => {
    setEditingMember(member)
    setNewMemberData({
      name: member.name,
      role: member.role,
      specialty: member.specialty || "",
      phone: member.phone,
      email: member.email,
    })
    setShowEditMember(true)
  }

  const handleSaveMember = () => {
    if (editingMember) {
      // Update existing member
      const updatedCareTeam = careTeam.map((member) =>
        member.id === editingMember.id ? { ...member, ...newMemberData } : member,
      )
      // In a real app, this would update the database
      console.log("[v0] Updated care team member:", updatedCareTeam)
    } else {
      // Add new member
      const newMember = {
        id: Date.now(),
        ...newMemberData,
        avatar: newMemberData.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
        nextAppointment: null,
      }
      careTeam.push(newMember)
      console.log("[v0] Added new care team member:", newMember)
    }

    // Reset form and close modal
    setNewMemberData({
      name: "",
      role: "",
      specialty: "",
      phone: "",
      email: "",
    })
    setEditingMember(null)
    setShowEditMember(false)
    setShowAddMember(false)
  }

  const handleCancelMemberEdit = () => {
    setNewMemberData({
      name: "",
      role: "",
      specialty: "",
      phone: "",
      email: "",
    })
    setEditingMember(null)
    setShowEditMember(false)
    setShowAddMember(false)
  }

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment)
    setAppointmentForm({
      title: appointment.title,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      location: appointment.location || "",
      notes: appointment.notes || "",
    })
    setShowEditAppointment(true)
  }

  const handleEditCaregiver = (caregiver: any, index: number) => {
    setEditingCaregiver({ ...caregiver, index })
    setCaregiverForm({
      name: caregiver.name,
      role: caregiver.role,
      phone: caregiver.phone,
      email: caregiver.email,
    })
    setShowEditCaregiver(true)
  }

  const handleChildSelect = (childId: string) => {
    const child = children.find((c) => c.id === childId)
    if (child) {
      setSelectedChild(child)
    }
  }

  return (
    <PageWrapper selectedChildId={selectedChild.id} onChildSelect={handleChildSelect} showChildSelector={true}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-[45] md:relative md:bg-transparent md:border-t-0 md:backdrop-blur-none">
            <div className="pl-0 pr-1 sm:px-0">
              <TabsList className="flex w-full bg-transparent md:bg-gray-50/50 h-auto p-0 md:p-1 md:justify-center md:rounded-2xl">
                <TabsTrigger
                  value="overview"
                  className="flex-1 md:min-w-[120px] h-12 px-2 md:px-6 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=inactive]:bg-gray-100/60 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200/80 data-[state=inactive]:hover:text-gray-900 rounded-full mx-0.5 md:mx-1 text-xs md:text-sm font-medium transition-all duration-300 ease-out touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="font-medium">Overview</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  className="flex-1 md:min-w-[120px] h-12 px-2 md:px-6 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=inactive]:bg-gray-100/60 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200/80 data-[state=inactive]:hover:text-gray-900 rounded-full mx-0.5 md:mx-1 text-xs md:text-sm font-medium transition-all duration-300 ease-out touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="font-medium">Milestone</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="tracker"
                  className="flex-1 md:min-w-[120px] h-12 px-2 md:px-6 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=inactive]:bg-gray-100/60 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200/80 data-[state=inactive]:hover:text-gray-900 rounded-full mx-0.5 md:mx-1 text-xs md:text-sm font-medium transition-all duration-300 ease-out touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="font-medium">Log & Track</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="care-team"
                  className="flex-1 md:min-w-[120px] h-12 px-2 md:px-6 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=inactive]:bg-gray-100/60 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200/80 data-[state=inactive]:hover:text-gray-900 rounded-full mx-0.5 md:mx-1 text-xs md:text-sm font-medium transition-all duration-300 ease-out touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="font-medium">Care Team</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <div className="flex justify-center pt-1 pb-2 md:hidden">
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0 pl-0 pr-1 sm:px-0">
            {/* Hero Section - Health Overview */}
            <Card className="border-border bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm mb-4 sm:mb-6">
              <CardContent className="pl-1 pr-2 py-2 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[64px]">
                  <div className="flex-shrink-0">
                    <DoubleCircleChart heightPercentile={65} weightPercentile={58} size={140} className="mb-4" />
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
                      className="bg-primary hover:bg-primary/90 px-6 text-primary-foreground"
                      onClick={() => setActiveTab("goals")} // Navigate to Milestone tab instead of separate route
                    >
                      Log Health Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overview Banner - Compact version */}
            <div className="bg-card rounded-lg border border-border pl-1 pr-2 py-2 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Today's Tasks */}
                <Card className="border border-border shadow-sm bg-card">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Today's Tasks</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        onClick={() => setShowAddTaskDialog(true)}
                      >
                        <Plus className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      {activeTasks.length === 0 ? (
                        <div className="text-center py-6">
                          <CheckSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No tasks yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-transparent"
                            onClick={() => setShowAddTaskDialog(true)}
                          >
                            Add your first task
                          </Button>
                        </div>
                      ) : (
                        <>
                          {(showAllTasks ? activeTasks : activeTasks.slice(0, 3)).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 py-1 group">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="rounded border-border h-4 w-4 text-primary focus:ring-primary"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">{task.time}</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {activeTasks.length > 3 && (
                        <div className="pt-2 border-t border-border">
                          <button
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                            onClick={() => setShowAllTasks(!showAllTasks)}
                          >
                            {showAllTasks ? "Show less" : `View ${activeTasks.length - 3} more`}
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Symptoms */}
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                        Recent Symptoms
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setActiveTab("tracker")}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      <div className="relative p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border-2 border-transparent bg-clip-padding">
                        {/* AI-themed animated border */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-60 blur-sm animate-pulse"></div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30"></div>
                        <div className="absolute inset-[1px] rounded-lg bg-white"></div>

                        {/* Content */}
                        <div className="relative flex items-start gap-3 py-1">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                AI Insights
                              </span>
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                <div
                                  className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Sleep improved. GI symptoms decreased after dietary changes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">Sleep Issues</p>
                              <span className="text-sm text-gray-500">2d ago</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">Behavior Episode</p>
                              <span className="text-sm text-gray-500">1w ago</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                          onClick={() => setActiveTab("tracker")}
                        >
                          View more
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Medications</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={() => handleTrackerCardClick("medication")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Albuterol 90 mcg</p>
                            <p className="text-sm text-gray-600 mt-0.5">Next: 2:00 PM</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Vitamin D3</p>
                            <p className="text-sm text-gray-600 mt-0.5">Daily with breakfast</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button className="text-sm text-primary hover:text-primary/80 font-medium">View more</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming */}
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                        Upcoming Appointments
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0 ml-2"
                        onClick={() => setShowAddAppointment(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Pulmonology</p>
                            <p className="text-sm text-gray-600 mt-0.5">Wed Sep 10, 3 PM</p>
                            <span className="text-sm text-gray-500">Telehealth</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Lab Work</p>
                            <p className="text-sm text-gray-600 mt-0.5">Fri Sep 12, 9 AM</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                          onClick={() => router.push("/doc-hub")}
                        >
                          View more
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Overview Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      Recommended Nutritions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Leucovorin</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Helps children impacted by ASD, PMS, RETT with GI issues{" "}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Magnesium</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Helps with sleep</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Active form of Vitamin B12</p>
                            <span className="text-sm text-gray-500">...</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Weight management target</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Symptom Tracked</p>
                            <span className="text-sm text-gray-500">1h ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Mild cough reported</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Vitals Recorded</p>
                            <span className="text-sm text-gray-500">3h ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Temperature: 98.6°F</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">Care Plan Updated</p>
                            <span className="text-sm text-gray-500">6h ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Asthma management plan</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">Healthcare Provider Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary mb-3">
                  Connect with your healthcare providers to automatically share relevant health data before
                  appointments.
                </p>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Connect Provider
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 sm:space-y-6 mt-0">
            {/* Goals Header */}
            <Card className="border-border bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[64px]">
                  <div className="flex-shrink-0">
                    <DonutChart percentage={85} itemsLeft={3} isComplete={false} size={120} showAnimation={true} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      18M Developmental Milestones
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                      15 of 18 milestones achieved • 3 milestones remaining
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      size="default"
                      className="bg-primary hover:bg-primary/90 px-6 flex-1 sm:flex-none text-primary-foreground"
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
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Lightbulb className="h-5 w-5" />
                    Smart Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 py-0">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-muted rounded-lg border border-border">
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
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-start gap-3">
                          <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Climbing Practice</h4>
                            <p className="text-sm text-gray-600 mb-3">Encourage climbing on playground equipment</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/30 bg-transparent"
                              onClick={handleScheduleActivity}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule Activity
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border shadow-sm bg-card">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-5 w-5" />
                    Care Insights
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-3 sm:px-4 py-0">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">7-day milestone streak</span>
                        </div>
                        <p className="text-sm text-gray-600">Consistent progress across all categories</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Language development accelerating</span>
                        </div>
                        <p className="text-sm text-gray-600">25% improvement in vocabulary milestones</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Focus area identified</span>
                        </div>
                        <p className="text-sm text-gray-600">Social interaction skills need attention</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracker" className="space-y-4 sm:space-y-6 mt-0">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 mb-6 sm:mb-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">What would you like to log?</h2>
              </div>
            </div>

            {/* Main tracking cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card
                className="border-2 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer"
                onClick={() => handleTrackerCardClick("symptom")}
              >
                <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Symptom</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Log symptoms and severity</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => handleTrackerCardClick("nutrition")}
              >
                <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nutrition</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Track meals and food intake</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => handleTrackerCardClick("medication")}
              >
                <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mb-3 sm:mb-4">
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
              <Card className="border-border bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 min-h-[64px]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Care Circle</h2>
                      <p className="text-sm sm:text-base text-gray-700 mb-4">
                        {appointments.length} upcoming appointments • 3 active conversations • 85% care plan completion
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        onClick={() => setShowAddMember(true)}
                        size="default"
                        className="bg-primary hover:bg-primary/90 px-6 text-primary-foreground"
                      >
                        Add Member
                      </Button>
                      <Button
                        size="default"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
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
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Care Team</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-4">
                      {[
                        { name: "Dr. Sarah Johnson", role: "Pulmonologist", status: "Available", avatar: "SJ" },
                        { name: "Nurse Emma Wilson", role: "Care Coordinator", status: "Busy", avatar: "EW" },
                        { name: "Dr. Michael Chen", role: "Pediatrician", status: "Available", avatar: "MC" },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-muted-foreground">{member.avatar}</span>
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
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        className="w-full bg-transparent"
                        variant="outline"
                        onClick={() => setShowAddMember(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Team Member
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card className="border border-border shadow-sm bg-card">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 py-0">
                    <div className="space-y-4">
                      {appointments.map((appointment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
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
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        className="w-full bg-transparent"
                        variant="outline"
                        onClick={() => setShowAddAppointment(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Schedule Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showTrackerLog && <TrackerLogView onClose={() => setShowTrackerLog(false)} />}

      {showAddNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
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

      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Care Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Input
                  value={newMemberData.role}
                  onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                  placeholder="e.g., Pediatrician, Nurse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <Input
                  value={newMemberData.specialty}
                  onChange={(e) => setNewMemberData({ ...newMemberData, specialty: e.target.value })}
                  placeholder="e.g., Cardiology, Neurology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={newMemberData.phone}
                  onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveMember} className="flex-1">
                Add Member
              </Button>
              <Button variant="outline" onClick={handleCancelMemberEdit} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Care Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Input
                  value={newMemberData.role}
                  onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                  placeholder="e.g., Pediatrician, Nurse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <Input
                  value={newMemberData.specialty}
                  onChange={(e) => setNewMemberData({ ...newMemberData, specialty: e.target.value })}
                  placeholder="e.g., Cardiology, Neurology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={newMemberData.phone}
                  onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveMember} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelMemberEdit} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, title: e.target.value })}
                  placeholder="Appointment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Input
                  value={appointmentForm.type}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                  placeholder="e.g., Check-up, Consultation"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  console.log("[v0] Saving appointment:", appointmentForm)
                  setShowEditAppointment(false)
                  setEditingAppointment(null)
                }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditAppointment(false)
                  setEditingAppointment(null)
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditCaregiver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Caregiver</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={caregiverForm.name}
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, name: e.target.value })}
                  placeholder="Caregiver name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Input
                  value={caregiverForm.role}
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, role: e.target.value })}
                  placeholder="e.g., Primary Caregiver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={caregiverForm.phone}
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={caregiverForm.email}
                  onChange={(e) => setCaregiverForm({ ...caregiverForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  console.log("[v0] Saving caregiver:", caregiverForm)
                  setShowEditCaregiver(false)
                  setEditingCaregiver(null)
                }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditCaregiver(false)
                  setEditingCaregiver(null)
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddTaskDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task description"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (Optional)</label>
                <Input
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  placeholder="e.g., 9:00 AM, After lunch, Anytime"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddTask} className="flex-1" disabled={!newTask.title.trim()}>
                Add Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTaskDialog(false)
                  setNewTask({ title: "", time: "" })
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditTaskDialog && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Enter task description"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  value={editingTask.time}
                  onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
                  placeholder="e.g., 9:00 AM, After lunch, Anytime"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleUpdateTask} className="flex-1" disabled={!editingTask.title.trim()}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditTaskDialog(false)
                  setEditingTask(null)
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule New Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, title: e.target.value })}
                  placeholder="Appointment title"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Input
                  value={appointmentForm.type}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                  placeholder="e.g., Check-up, Consultation, Telehealth"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                <Input
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })}
                  placeholder="e.g., Main Office, Telehealth, Lab"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <Input
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  placeholder="Additional notes or instructions"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  console.log("[v0] Creating new appointment:", appointmentForm)
                  setShowAddAppointment(false)
                  // Reset form
                  setAppointmentForm({
                    title: "",
                    date: "",
                    time: "",
                    type: "",
                    location: "",
                    notes: "",
                  })
                }}
                className="flex-1"
                disabled={!appointmentForm.title.trim() || !appointmentForm.date || !appointmentForm.time}
              >
                Schedule Appointment
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddAppointment(false)
                  // Reset form
                  setAppointmentForm({
                    title: "",
                    date: "",
                    time: "",
                    type: "",
                    location: "",
                    notes: "",
                  })
                }}
                className="flex-1 bg-transparent"
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
