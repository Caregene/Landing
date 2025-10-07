"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostDetail } from "../../../../components/post-detail"
import { apiClient, type Post } from "../../../../lib/api-client"

interface PageProps {
  params: Promise<{ slug: string; postId: string }>
}

export default function PostPage({ params }: PageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState<string>("")
  const [postId, setPostId] = useState<string>("")
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock user for now; replace with real auth later
  const user = {
    id: "current-user",
    name: "Current User",
    image: "/placeholder-user.jpg",
  }

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug)
      setPostId(p.postId)
    })
  }, [params])

  useEffect(() => {
    const load = async () => {
      if (!postId) return
      setLoading(true)
      try {
        const res = await apiClient.getPost(postId)
        if (res?.data) setPost(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  if (!slug || !postId || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading post...</span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <p className="text-sm text-gray-600 mb-3">Post not found or unavailable.</p>
        <button className="text-blue-600 hover:underline" onClick={() => router.push(`/community/community/${slug}`)}>
          Back to community
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <PostDetail
        post={post}
        onBack={() => router.push(`/community/community/${slug}`)}
        user={user}
        onAddComment={() => {}}
        onAddReply={() => {}}
        onReaction={() => {}}
        userReaction={""}
      />
    </div>
  )
}
