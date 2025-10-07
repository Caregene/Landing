"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Thermometer,
  Heart,
  Brain,
  Zap,
  Apple,
  Coffee,
  Utensils,
  Droplets,
  Pill,
  Clock,
  Shield,
  Activity,
} from "lucide-react"

interface TrackerOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  category: "symptom" | "nutrition" | "medication" | null
  onOptionSelect: (option: string) => void
}

const trackerOptions = {
  symptom: [
    { name: "Fever", icon: Thermometer, color: "bg-red-500" },
    { name: "Headache", icon: Brain, color: "bg-orange-500" },
    { name: "Fatigue", icon: Zap, color: "bg-yellow-500" },
    { name: "Nausea", icon: Activity, color: "bg-green-500" },
    { name: "Pain", icon: Heart, color: "bg-red-600" },
    { name: "Cough", icon: Activity, color: "bg-blue-500" },
  ],
  nutrition: [
    { name: "Breakfast", icon: Coffee, color: "bg-orange-500" },
    { name: "Lunch", icon: Utensils, color: "bg-green-500" },
    { name: "Dinner", icon: Utensils, color: "bg-blue-500" },
    { name: "Snack", icon: Apple, color: "bg-yellow-500" },
    { name: "Water Intake", icon: Droplets, color: "bg-cyan-500" },
    { name: "Supplements", icon: Shield, color: "bg-purple-500" },
  ],
  medication: [
    { name: "Daily Medication", icon: Pill, color: "bg-blue-500" },
    { name: "As Needed", icon: Clock, color: "bg-orange-500" },
    { name: "Vitamins", icon: Shield, color: "bg-green-500" },
    { name: "Pain Relief", icon: Heart, color: "bg-red-500" },
    { name: "Antibiotics", icon: Shield, color: "bg-purple-500" },
    { name: "Other", icon: Pill, color: "bg-gray-500" },
  ],
}

export function TrackerOptionsModal({ isOpen, onClose, category, onOptionSelect }: TrackerOptionsModalProps) {
  if (!category) return null

  const options = trackerOptions[category]
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Log {categoryTitle}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {options.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.name}
                className="border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => onOptionSelect(option.name)}
              >
                <CardContent className="flex flex-col items-center text-center p-4">
                  <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center mb-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{option.name}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
