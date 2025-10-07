"use client"

import { useState, useRef, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Video, Send, Image } from "lucide-react"
import { CreatePostModal } from "./components/create-post-modal"
import { usePosts } from "./hooks/use-api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PostDetail } from "./components/post-detail"
import type { Post } from "./lib/api-client"
import { apiClient } from "./lib/api-client"
import { useRouter } from "next/navigation"

const getImageUrl = (imagePath: string) => {
  if (!imagePath || typeof imagePath !== 'string') return '/placeholder.jpg'
  const src = imagePath.trim()
  if (src.includes('/api/image-proxy')) {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
      const u = new URL(src, base)
      const target = u.searchParams.get('url')
      if (target) return target
    } catch {}
  }
  const lower = src.toLowerCase()
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:') || lower.startsWith('blob:')) {
    return src
  }
  if (src.startsWith('//')) {
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
    return `${protocol}${src}`
  }
  const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const needsSlash = src.startsWith('/') ? '' : '/'
  return `${BACKEND_ORIGIN}${needsSlash}${src}`
}

const getLocalCommentCount = (post: any): number => {
  if (!post) return 0
  return (
    post.stats?.totalComments ||
    post.commentCount ||
    (Array.isArray(post.comments) ? post.comments.length : 0) ||
    0
  )
}

const formatRelativeTime = (timestamp?: string): string => {
  if (!timestamp) return ''
  const now = new Date()
  const postDate = new Date(timestamp)
  const diffMs = now.getTime() - postDate.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(days / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

const normalizeMediaSrc = (m: any): string => {
  if (!m) return ''
  if (typeof m === 'string') return m
  return m.url || m.src || m.path || m.link || m.href || ''
}

export default function CommunityPage() {
  const router = useRouter()
  const [openCreatePost, setOpenCreatePost] = useState(false)
  const [initialPicker, setInitialPicker] = useState<"image" | "video" | undefined>(undefined)
  const [initialFiles, setInitialFiles] = useState<File[] | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openPostDetail, setOpenPostDetail] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const { posts, loading: postsLoading, error: postsError, refetch } = usePosts({ limit: 20, sort: 'recent' })

  const [commentCountByPost, setCommentCountByPost] = useState<Record<string, number>>({})
  const [visiblePostIds, setVisiblePostIds] = useState<Set<string>>(new Set())
  const postRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!posts || posts.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        setVisiblePostIds(prev => {
          const next = new Set(prev)
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.postId
            if (!id) continue
            if (entry.isIntersecting) next.add(id)
          }
          return next
        })
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    )
    for (const p of posts as any[]) {
      const id = p._id || p.id
      if (!id) continue
      const el = postRefs.current[id]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [posts])

  useEffect(() => {
    const fetchCounts = async () => {
      if (!posts || visiblePostIds.size === 0) return
      const idsToFetch = (posts as any[])
        .map(p => p._id || p.id)
        .filter((id: string) => id && visiblePostIds.has(id) && commentCountByPost[id] === undefined)
      if (idsToFetch.length === 0) return
      const results: Array<[string, number]> = []
      await Promise.all(idsToFetch.map(async (id: string) => {
        try {
          const resp = await apiClient.getCommentCountForPost(id)
          if (resp.data && typeof resp.data.commentCount === 'number') {
            results.push([id, resp.data.commentCount])
          }
        } catch (e) {}
      }))
      if (results.length > 0) {
        setCommentCountByPost(prev => {
          const next = { ...prev }
          for (const [id, cnt] of results) next[id] = cnt
          return next
        })
      }
    }
    fetchCounts()
  }, [visiblePostIds, posts, commentCountByPost])

  const [reactionCountOverrides, setReactionCountOverrides] = useState<Record<string, number>>({})

  const currentUser = { id: "current-user", name: "You", image: "/placeholder-user.jpg" }

  const handleToggleLike = async (post: Post) => {
    try {
      const alreadyLiked = false
      if (alreadyLiked) {
        await apiClient.removeReactionFromPost(post._id)
      } else {
        await apiClient.addReactionToPost(post._id)
      }
    } catch (err) {
      console.error('Failed to toggle like', err)
    }
  }

  const handleSharePost = (post: Post) => {
    try {
      const url = `${window.location.origin}/community/community/${post.community.slug}/post/${post._id}`
      if (navigator.share) {
        navigator.share({ title: post.title || 'Community Post', url }).catch(() => navigator.clipboard.writeText(url))
      } else {
        navigator.clipboard.writeText(url)
      }
    } catch (err) {
      console.error('Share failed', err)
    }
  }

  const handlePickMedia = (type: "image" | "video") => {
    if (!fileInputRef.current) return
    fileInputRef.current.accept = type === "image" ? "image/*" : "video/*"
    fileInputRef.current.click()
  }

  const onFilesChosen: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setInitialFiles(files)
    setInitialPicker(undefined)
    setOpenCreatePost(true)
    if (e.target) (e.target as HTMLInputElement).value = ""
  }
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        

  
            <Tabs defaultValue="community" className="space-y-6">
              

              <TabsContent value="community" className="space-y-6">
                

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="shrink-0">
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => { setInitialPicker(undefined); setOpenCreatePost(true) }}
                        className="flex-1 text-left rounded-full border bg-muted/30 hover:bg-muted px-4 py-3 text-sm text-muted-foreground transition"
                      >
                        Share your experience, ask a question, or offer support...
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-foreground/80 hover:bg-accent/50"
                          onClick={() => handlePickMedia("image")}
                        >
                          <Image className="h-4 w-4 mr-2 rotate-90" /> Photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-foreground/80 hover:bg-accent/50"
                          onClick={() => handlePickMedia("video")}
                        >
                          <Video className="h-4 w-4 mr-2" /> Video
                        </Button>
                       
                        <Button className="sm:w-auto" onClick={() => { setInitialPicker(undefined); setOpenCreatePost(true) }}>
                          <Send className="h-4 w-4 mr-2" /> Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {postsLoading && (
                    <Card>
                      <CardContent className="p-6 text-sm text-muted-foreground">Loading posts…</CardContent>
                    </Card>
                  )}
                  {postsError && (
                    <Card>
                      <CardContent className="p-6 text-sm text-destructive">Failed to load posts.</CardContent>
                    </Card>
                  )}
                  {!postsLoading && !postsError && (posts?.length || 0) === 0 && (
                    <Card>
                      <CardContent className="p-6 text-sm text-muted-foreground">No posts yet. Be the first to share.</CardContent>
                    </Card>
                  )}
                  {(posts || []).map((p: any) => {
                    const isAnon = p.isAnonymous || p.anonymous
                    const authorName = isAnon ? 'Anonymous' : (p.author?.name || 'User')
                    const avatarSrc = !isAnon ? (p.author?.avatar ? getImageUrl(p.author.avatar) : '') : ''
                    const created = formatRelativeTime(p.createdAt)
                    const images: string[] = Array.isArray(p.images) ? p.images.map(normalizeMediaSrc).filter(Boolean) : []
                    const videos: string[] = Array.isArray(p.videos) ? p.videos.map(normalizeMediaSrc).filter(Boolean) : []
                    const tags: string[] = Array.isArray(p.tags) ? p.tags : []
                    const baseReactions = p.stats?.totalReactions ?? 0
                    const reactions = reactionCountOverrides[p._id || p.id] ?? baseReactions
                    const pid = p._id || p.id
                    const commentCount = commentCountByPost[pid] ?? getLocalCommentCount(p)
                    return (
                      <div key={pid} ref={(el) => { if (pid) postRefs.current[pid] = el }} data-post-id={pid}>
                        <Card onClick={() => { setSelectedPost(p as Post); setOpenPostDetail(true) }} className="cursor-pointer hover:bg-muted/50 transition">
                          <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <Avatar className="shrink-0">
                              {avatarSrc ? <AvatarImage src={avatarSrc} alt={authorName} /> : null}
                              <AvatarFallback>{(authorName || 'U').slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-semibold">{authorName}</span>
                                {p.community?.name && (
                                  <Badge variant="outline" className="text-xs">{p.community.name}</Badge>
                                )}
                                {created && (
                                  <span className="text-sm text-muted-foreground">{created}</span>
                                )}
                              </div>
                              {p.content && (
                                <p className="text-sm mb-3 whitespace-pre-wrap break-words">{p.content}</p>
                              )}
                              {(images.length > 0 || videos.length > 0) && (
                                
                                  <div className={`grid gap-2 ${
                                    images.length + videos.length === 1 ? 'grid-cols-1' :
                                    images.length + videos.length === 2 ? 'grid-cols-2' :
                                    images.length + videos.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
                                  }`}>
                                    {images.map((src: string, idx: number) => (
                                      <img
                                        key={`img-${idx}`}
                                        src={getImageUrl(src)}
                                        alt="post media"
                                        className="w-full h-40 object-cover rounded-md ring-1 ring-border"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg' }}
                                      />
                                    ))}
                                    {videos.map((src: string, idx: number) => (
                                      <video
                                        key={`vid-${idx}`}
                                        src={getImageUrl(src)}
                                        controls
                                        className="w-full h-40 object-cover rounded-md ring-1 ring-border"
                                        onError={(e) => { try { (e.currentTarget as HTMLVideoElement).poster = '/placeholder.jpg' } catch {} }}
                                      />
                                    ))}
                                  </div>
                                
                              )}
                              {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {tags.map((t) => (
                                    <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 sm:gap-4">
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleLike(p as Post) }}>
                                  <Heart className="h-4 w-4 mr-1" />
                                  {reactions}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPost(p as Post); setOpenPostDetail(true) }}>
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {commentCount}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleSharePost(p as Post) }}>
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* The Support Groups tab now navigates to its own page at /community/community */}

              

              {/* Other tabs navigate to dedicated routes */}
            </Tabs>
        
        <CreatePostModal
          open={openCreatePost}
          onOpenChange={(o) => { if (!o) { setInitialPicker(undefined); setInitialFiles(undefined) } ; setOpenCreatePost(o) }}
          onPostCreated={() => setOpenCreatePost(false)}
          initialPicker={initialPicker}
          initialFiles={initialFiles}
        />
  <Dialog open={openPostDetail} onOpenChange={(o) => { if (!o) { const pid = (selectedPost as any)?._id || (selectedPost as any)?.id; if (pid) { setReactionCountOverrides(prev => { const { [pid]: _omitR, ...restR } = prev; return restR }) } ; setSelectedPost(null); refetch() } ; setOpenPostDetail(o) }}>
          <DialogContent className="w-[95vw] sm:w-[90vw] lg:w-[75vw] max-w-[95vw] sm:max-w-[90vw] lg:max-w-[75vw] p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Post details</DialogTitle>
            </DialogHeader>
            {selectedPost ? (
              <div className="p-4 max-h-[85vh] overflow-y-auto">
                <PostDetail
                  post={selectedPost}
                  user={currentUser}
                  onBack={() => setOpenPostDetail(false)}
                  onAddComment={async (postId, comment) => {
                    try {
                      const content = (comment?.content || '').toString()
                      if (!content.trim()) return
                      const resp = await apiClient.createComment({ content, postId })
                      if (!resp.error) {
                        setCommentCountByPost(prev => ({
                          ...prev,
                          [postId]: (prev[postId] ?? getLocalCommentCount(posts?.find((x:any)=> (x._id||x.id)===postId))) + 1
                        }))
                      }
                    } catch (err) {
                      console.error('Failed to comment', err)
                    }
                  }}
                  onAddReply={() => {}}
                  onReaction={async (postId, reactionType) => {
                    try {
                      if (reactionType === 'unlike') {
                        await apiClient.removeReactionFromPost(postId)
                        // decrement override immediately
                        setReactionCountOverrides(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] ?? (posts?.find((x:any)=> (x._id||x.id)===postId)?.stats?.totalReactions ?? 0)) - 1) }))
                      } else {
                        await apiClient.addReactionToPost(postId)
                        // increment override immediately
                        setReactionCountOverrides(prev => ({ ...prev, [postId]: (prev[postId] ?? (posts?.find((x:any)=> (x._id||x.id)===postId)?.stats?.totalReactions ?? 0)) + 1 }))
                      }
                    } catch (err) {
                      console.error('Failed to react', err)
                    }
                  }}
                  onShare={() => handleSharePost(selectedPost)}
                  autoFocusComment={true}
                  variant="popup"
                  userReaction={""}
                />
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
        <input ref={fileInputRef} type="file" className="hidden" multiple onChange={onFilesChosen} />
      </div>
    </PageWrapper>
  )
}
