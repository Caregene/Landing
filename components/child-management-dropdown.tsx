"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, Plus, Edit, Trash2, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getChildren, addChild, updateChild, deleteChild, type Child } from "@/lib/milestone-data-layer"
import { useRouter } from "next/navigation"

interface ChildManagementDropdownProps {
  selectedChildId?: string
  onChildSelect?: (childId: string) => void
  lastExperience?: string // URL to navigate back to after changes
}

export function ChildManagementDropdown({
  selectedChildId,
  onChildSelect,
  lastExperience = "/",
}: ChildManagementDropdownProps) {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showManageModal, setShowManageModal] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [isAddingChild, setIsAddingChild] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    birthDate: "",
    dueDate: "",
    sex: "",
    photoFile: null as File | null,
    photoPreview: "",
  })

  useEffect(() => {
    try {
      const loadedChildren = getChildren() || []
      setChildren(loadedChildren)

      if (selectedChildId) {
        const child = loadedChildren.find((c) => c.id === selectedChildId)
        setSelectedChild(child || null)
      } else if (loadedChildren.length > 0) {
        setSelectedChild(loadedChildren[0])
        onChildSelect?.(loadedChildren[0].id)
      }
    } catch (error) {
      console.error("Error loading children:", error)
      setChildren([])
    }
  }, [selectedChildId, onChildSelect])

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child)
    onChildSelect?.(child.id)
  }

  const openAddChild = () => {
    setIsAddingChild(true)
    setEditingChild(null)
    setFormData({
      firstName: "",
      birthDate: "",
      dueDate: "",
      sex: "",
      photoFile: null,
      photoPreview: "",
    })
    setShowManageModal(true)
  }

  const openEditChild = (child: Child) => {
    setIsAddingChild(false)
    setEditingChild(child)
    setFormData({
      firstName: child.firstName,
      birthDate: child.birthDate,
      dueDate: child.dueDate || "",
      sex: child.sex || "",
      photoFile: null,
      photoPreview: child.photoUrl || "",
    })
    setShowManageModal(true)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          photoFile: file,
          photoPreview: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoPreview: "",
    }))
  }

  const handleSave = async () => {
    try {
      let photoUrl = formData.photoPreview

      if (formData.photoFile) {
        photoUrl = formData.photoPreview
      }

      const childData = {
        firstName: formData.firstName,
        birthDate: formData.birthDate,
        dueDate: formData.dueDate || undefined,
        sex: formData.sex as "F" | "M" | "X" | undefined,
        photoUrl: photoUrl,
      }

      if (isAddingChild) {
        const newChild = addChild(childData)
        setChildren((prev) => [...prev, newChild])
        setSelectedChild(newChild)
        onChildSelect?.(newChild.id)
      } else if (editingChild) {
        const updatedChild = updateChild(editingChild.id, childData)
        if (updatedChild) {
          setChildren((prev) => prev.map((child) => (child.id === editingChild.id ? updatedChild : child)))
          if (selectedChild?.id === editingChild.id) {
            setSelectedChild(updatedChild)
          }
        }
      }

      setShowManageModal(false)
      router.push(lastExperience)
    } catch (error) {
      console.error("Error saving child:", error)
    }
  }

  const handleDelete = (childId: string) => {
    if (window.confirm("Are you sure you want to delete this child profile?")) {
      try {
        deleteChild(childId)
        setChildren((prev) => prev.filter((child) => child.id !== childId))

        if (selectedChild?.id === childId) {
          const remainingChildren = children.filter((child) => child.id !== childId)
          if (remainingChildren.length > 0) {
            setSelectedChild(remainingChildren[0])
            onChildSelect?.(remainingChildren[0].id)
          } else {
            setSelectedChild(null)
          }
        }
      } catch (error) {
        console.error("Error deleting child:", error)
      }
    }
  }

  const handleCancel = () => {
    setShowManageModal(false)
    router.push(lastExperience)
  }

  const calculateAge = (birthDate: string, dueDate?: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())

    if (dueDate) {
      const due = new Date(dueDate)
      const prematureMonths = Math.floor((due.getTime() - birth.getTime()) / (30 * 24 * 60 * 60 * 1000))
      if (prematureMonths > 0) {
        months -= prematureMonths
      }
    }

    if (months < 12) {
      return `${Math.max(0, months)} months`
    } else if (months < 24) {
      return `${Math.floor(months / 12)} year ${months % 12} months`
    } else {
      return `${Math.floor(months / 12)} years`
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-3 bg-white/95 backdrop-blur border-gray-200 hover:bg-gray-50 px-3 py-2 h-10"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={selectedChild?.photoUrl || "/placeholder.svg?height=28&width=28&query=child profile"}
                alt={selectedChild?.firstName || "Child"}
              />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600 font-medium">
                {selectedChild ? selectedChild.firstName.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {selectedChild ? selectedChild.firstName : "Select Child"}
              </span>
              {selectedChild && (
                <span className="text-xs text-gray-500">
                  {calculateAge(selectedChild.birthDate, selectedChild.dueDate)}
                </span>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 mb-20 z-[50]">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">SELECT CHILD</div>
            {children.map((child) => (
              <DropdownMenuItem
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                  <AvatarFallback className="text-xs bg-gray-100">{child.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{child.firstName}</div>
                  <div className="text-xs text-gray-500">{calculateAge(child.birthDate, child.dueDate)}</div>
                </div>
                {selectedChild?.id === child.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">MANAGE CHILDREN</div>

            <DropdownMenuItem onClick={openAddChild} className="flex items-center gap-2 p-3 rounded-lg">
              <Plus className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">Add New Child</span>
            </DropdownMenuItem>

            {children.length > 0 && (
              <>
                {children.map((child) => (
                  <div key={`manage-${child.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                      <AvatarFallback className="bg-gray-100">
                        <User className="h-8 w-8 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm">{child.firstName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditChild(child)}
                      className="h-6 w-6 p-0 hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(child.id)}
                      className="h-6 w-6 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent className="max-w-lg mx-4 rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader className="pb-6 pt-8 px-8">
            <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
              {isAddingChild ? "Add New Child" : `Edit ${editingChild?.firstName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 p-1 shadow-lg">
                  <Avatar className="h-full w-full">
                    {formData.photoPreview ? (
                      <AvatarImage
                        src={formData.photoPreview || "/placeholder.svg"}
                        alt="Child photo"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full">
                        <User className="h-10 w-10 text-blue-600" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              {formData.photoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full px-4 py-2"
                >
                  Remove Photo
                </Button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 mb-2 block">
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700 mb-2 block">
                  Due Date <span className="text-gray-400 font-normal">(if premature)</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Sex</Label>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, sex: "M" }))}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.sex === "M" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, sex: "F" }))}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.sex === "F" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.firstName || !formData.birthDate || !formData.sex}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
