"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Upload, User } from "lucide-react"
import Link from "next/link"
import { getChildren, updateChild, type Child } from "@/lib/milestone-data-layer"
import { GlobalHeader } from "@/components/global-header"

export default function EditChildPage() {
  const router = useRouter()
  const params = useParams()
  const childId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [child, setChild] = useState<Child | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    birthDate: "",
    dueDate: "",
    sex: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const children = getChildren()
    const foundChild = children.find((c) => c.id === childId)

    if (foundChild) {
      setChild(foundChild)
      setFormData({
        firstName: foundChild.firstName,
        birthDate: foundChild.birthDate,
        dueDate: foundChild.dueDate || "",
        sex: foundChild.sex || "",
      })
      if (foundChild.photoUrl) {
        setImagePreview(foundChild.photoUrl)
      }
    }
    setIsLoading(false)
  }, [childId])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.birthDate || !child) return

    setIsSubmitting(true)

    try {
      let photoUrl = child.photoUrl || ""
      if (selectedImage) {
        photoUrl = URL.createObjectURL(selectedImage)
      }

      const childData = {
        firstName: formData.firstName,
        birthDate: formData.birthDate,
        dueDate: formData.dueDate || undefined,
        sex: formData.sex as "F" | "M" | "X" | undefined,
        photoUrl: photoUrl,
      }

      updateChild(child.id, childData)
      router.push("/milestone/children")
    } catch (error) {
      console.error("Error updating child:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <GlobalHeader showChildSelector={false} />
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Loading child information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <GlobalHeader showChildSelector={false} />
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-gray-900">Child Not Found</h1>
              <p className="text-gray-600">The child you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/milestone/children">Back to Children</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <GlobalHeader showChildSelector={false} />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/milestone/children">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Children
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Edit {child.firstName}</h1>
            <p className="text-gray-600 mt-1">Update your child's profile information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Child Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={imagePreview || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-100">
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter child's first name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date (if premature)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      placeholder="Leave blank if born on time"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="X">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting || !formData.firstName || !formData.birthDate}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/milestone/children">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
