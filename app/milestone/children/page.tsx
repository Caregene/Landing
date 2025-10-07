"use client"

import { ChildProfiles } from "@/components/milestone/child-profiles"
import { GlobalHeader } from "@/components/global-header"

export default function ChildrenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <GlobalHeader showChildSelector={false} />
      <div className="pt-16">
        <ChildProfiles />
      </div>
    </div>
  )
}
