"use client"

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageSquare, Share2, ArrowLeft, Send, Reply, ChevronDown, ChevronUp } from "lucide-react"
import { type Post, type Comment } from "../lib/api-client"
import { apiClient } from "../lib/api-client"

interface UserSummary {
    id: string
    name: string
    image?: string
}

interface CommentAuthor {
    id?: string
    name?: string
    avatar?: string
}

interface CommentItem {
    id?: string
    _id?: string
    content?: string
    createdAt?: string
    author?: CommentAuthor
    replies?: CommentItem[]
    reactions?: Array<{ type: 'like' | 'love' | 'laugh' | 'sad' | 'angry'; user?: { id?: string }; userId?: string }>
}

interface PostDetailProps {
    post: Post
    user: UserSummary
    onBack: () => void
    onAddComment?: (postId: string, comment: any) => void
    onAddReply?: (postId: string, commentId: string, reply: any) => void
    onReaction?: (postId: string, reactionType: string) => void
    userReaction?: string
    onShare?: () => void
    autoFocusComment?: boolean
    variant?: 'page' | 'popup'
    userReactions?: Record<string, string>
    onReactionUpdate?: (postId: string, reactionType: string) => void
    // Notify parent when the total comment count should change (e.g., +1 on add, -1 on revert)
    onCommentDelta?: (postId: string, delta: number) => void
    // Notify parent with the exact current total comment count whenever it changes
    onCommentCountUpdate?: (postId: string, newCount: number) => void
}

const getImageUrl = (imagePath?: string): string => {
    if (!imagePath || typeof imagePath !== "string") return "/placeholder.jpg"
    const lower = imagePath.toLowerCase()
    if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("data:" ) || lower.startsWith("blob:")) return imagePath
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000"
    return `${BACKEND_URL}${imagePath}`
}

// Normalize media entries that could be strings or objects
const normalizeMediaSrc = (m: any): string => {
    if (!m) return ''
    if (typeof m === 'string') return m
    return m.url || m.src || m.path || m.link || m.href || ''
}

const formatRelativeTime = (timestamp?: string): string => {
    if (!timestamp) return ""
    const now = new Date()
    const dt = new Date(timestamp)
    const diffMs = now.getTime() - dt.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days === 1) return "1 day ago"
    if (days < 7) return `${days} days ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    const months = Math.floor(days / 30)
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`
    const years = Math.floor(days / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
}

/**
 * Detailed post view including content, media, reactions, and comments.
 */
export const PostDetail: React.FC<PostDetailProps> = ({
    post,
    user,
    onBack,
    onAddComment,
    onAddReply: _onAddReply,
    onReaction,
    userReaction,
    onShare,
    autoFocusComment = false,
    variant: _variant,
    userReactions: _userReactions,
    onReactionUpdate,
    onCommentDelta,
    onCommentCountUpdate,
}) => {
    const { toast } = useToast()
    const [commentText, setCommentText] = useState<string>("")
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)
    const [commentsError, setCommentsError] = useState<string>("")
    const commentInputRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if (autoFocusComment && commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }, [autoFocusComment])

    const isAnonymous: boolean = Boolean((post as unknown as { isAnonymous?: boolean; anonymous?: boolean }).isAnonymous || (post as unknown as { anonymous?: boolean }).anonymous)
    const authorName: string = isAnonymous ? "Anonymous" : (post.author?.name || "User")
    const avatarSrc: string = isAnonymous ? "" : (post.author?.avatar ? getImageUrl(post.author.avatar) : "")
    const createdLabel: string = (post as any)?.community?.name || ""
    const images: readonly string[] = Array.isArray((post as unknown as { images?: any[] }).images) ? (post as unknown as { images: any[] }).images.map(normalizeMediaSrc).filter(Boolean) : []
    const videos: readonly string[] = Array.isArray((post as unknown as { videos?: any[] }).videos) ? (post as unknown as { videos: any[] }).videos.map(normalizeMediaSrc).filter(Boolean) : []
    const tags: readonly string[] = Array.isArray((post as unknown as { tags?: string[] }).tags) ? (post as unknown as { tags: string[] }).tags : []
    const initialReactionCount: number = (post as unknown as { stats?: { totalReactions?: number } }).stats?.totalReactions ?? 0
    const initialCommentsArray: CommentItem[] = useMemo(() => {
        const raw = (post as unknown as { comments?: CommentItem[] }).comments
        return Array.isArray(raw) ? raw : []
    }, [post])
    const initialCommentCount: number = (post as unknown as { stats?: { totalComments?: number } }).stats?.totalComments 
        ?? (Array.isArray((post as any).comments) ? (post as any).comments.length : 0)

    const [comments, setComments] = useState<CommentItem[]>(initialCommentsArray)
    const [reactionCount, setReactionCount] = useState<number>(initialReactionCount)
    const [commentCount, setCommentCount] = useState<number>(initialCommentCount)
    const [userReactionState, setUserReactionState] = useState<string | undefined>(userReaction)
    // New state for comment interactions
    const [showComments, setShowComments] = useState<boolean>(true)
    const [showAllComments, setShowAllComments] = useState<boolean>(false)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState<string>("")
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

    // Helpers to normalize and manipulate comments across varying backend shapes
    const normalizeAuthor = useCallback((raw: any): CommentAuthor | undefined => {
        if (!raw) return undefined
        const id = raw.id || raw._id || raw.userId || raw.authorId || raw.uid
        const name = raw.name || raw.username || raw.displayName || raw.userName
        const avatar = raw.avatar || raw.photoURL || raw.image || raw.avatarUrl || raw.avatarURL
        if (id || name || avatar) return { id, name, avatar }
        return undefined
    }, [])

    const normalizeComment = useCallback((c: any): CommentItem => {
        const author = normalizeAuthor(c?.author) || normalizeAuthor(c?.user) || normalizeAuthor(c?.createdBy) || (c?.userId ? { id: c.userId, name: c.userName, avatar: c.userAvatar } : undefined)
        const repliesRaw = Array.isArray(c?.replies) ? c.replies : (Array.isArray(c?.children) ? c.children : [])
        const reactionsRaw = Array.isArray(c?.reactions) ? c.reactions : []
        return {
            id: c?.id,
            _id: c?._id,
            content: c?.content || c?.text || c?.body || '',
            createdAt: c?.createdAt || c?.created_at || c?.timestamp,
            author,
            replies: repliesRaw.map((r: any) => normalizeComment(r)),
            reactions: reactionsRaw
        }
    }, [normalizeAuthor])

    const extractCommentsArray = useCallback((obj: any): any[] | null => {
        if (!obj) return null
        if (Array.isArray(obj)) return obj
        const keys = ['comments', 'items', 'results', 'data']
        for (const key of keys) {
            const val = obj[key]
            if (Array.isArray(val)) return val
            if (val && typeof val === 'object') {
                const nested = extractCommentsArray(val)
                if (nested) return nested
            }
        }
        return null
    }, [])

    const extractSingleComment = useCallback((obj: any): any | null => {
        if (!obj) return null
        if (Array.isArray(obj)) return obj[0] || null
        if (obj.comment) return obj.comment
        if (obj.data) return extractSingleComment(obj.data)
        // Heuristic: looks like a comment (has content/text and some id)
        const hasBody = obj.content || obj.text || obj.body
        const hasId = obj.id || obj._id
        if (hasBody && hasId) return obj
        return null
    }, [])

    const mapCommentsDeep = useCallback((arr: CommentItem[], mapper: (c: CommentItem) => CommentItem): CommentItem[] => {
        return arr.map(item => {
            const mapped = mapper(item)
            const replies = mapped.replies && mapped.replies.length > 0
                ? mapCommentsDeep(mapped.replies, mapper)
                : mapped.replies
            return { ...mapped, replies }
        })
    }, [])

    const getCommentById = useCallback((arr: CommentItem[], targetId: string): CommentItem | null => {
        for (const c of arr) {
            const cid = c.id || c._id
            if (cid === targetId) return c
            if (c.replies && c.replies.length) {
                const found = getCommentById(c.replies, targetId)
                if (found) return found
            }
        }
        return null
    }, [])

    // Fetch authoritative comment count from backend
    const refreshCommentCount = useCallback(async () => {
        try {
            const postId: string = (post as any)._id || (post as any).id
            if (!postId) return
            const resp = await apiClient.getCommentCountForPost(postId)
            if (resp?.data && typeof resp.data.commentCount === 'number') {
                setCommentCount(resp.data.commentCount)
            }
        } catch (e) {
            // ignore; keep current count
        }
    }, [post])

    // Sync when post prop changes
    useEffect(() => {
        setComments(initialCommentsArray)
        setReactionCount(initialReactionCount)
        setCommentCount(initialCommentCount)
        setUserReactionState(userReaction)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post])

    // Fetch latest comments from backend (list), count comes from separate endpoint
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoadingComments(true)
                setCommentsError("")
                const postId: string = (post as any)._id || (post as any).id
                const res = await apiClient.getComments(postId, { limit: 50, sort: 'recent' })
                if (res?.error) {
                    setCommentsError(res.error)
                    return
                }
                // Normalize various possible backend shapes
                const payload = res?.data as any
                const arr = extractCommentsArray(payload) || []
                const normalized = arr.map((c: any) => normalizeComment(c))
                setComments(normalized)
                // Comment count is authoritative from backend; refresh separately
                refreshCommentCount()
            } catch (err: any) {
                setCommentsError(err?.message || 'Failed to load comments')
            } finally {
                setIsLoadingComments(false)
            }
        }
        load()
        // Also refresh count on post change
        refreshCommentCount()
    }, [post, refreshCommentCount])

    // Emit exact comment count to parent for live syncing in feed
    useEffect(() => {
        const postId: string = (post as any)._id || (post as any).id
        if (postId && typeof commentCount === 'number') {
            onCommentCountUpdate?.(postId, commentCount)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentCount])

    const handleSendComment = async () => {
        const content = commentText.trim()
        if (!content) return
        const postId: string = (post as any)._id || (post as any).id
        const tempComment: CommentItem = {
            id: `temp-${Math.random().toString(36).slice(2)}`,
            content,
            createdAt: new Date().toISOString(),
            author: { id: user.id, name: user.name, avatar: user.image },
            replies: [],
        }
        // Optimistic update
        setComments((prev) => [tempComment, ...prev])
        setCommentCount((c) => c + 1)
        setCommentText("")
        // Let parent (feed) reflect the increment immediately
        onCommentDelta?.(postId, 1)

        try {
            if (onAddComment) {
                await onAddComment(postId, tempComment)
            } else {
                const res = await apiClient.createComment({ content, postId })
                if (res?.error) throw new Error(res.error)
                const createdRaw = extractSingleComment(res?.data)
                if (createdRaw) {
                    const created = normalizeComment(createdRaw)
                    setComments(prev => mapCommentsDeep(prev, c => (c.id === tempComment.id ? created : c)))
                }
            }
            // Reconcile with server count
            refreshCommentCount()
        } catch (err) {
            console.error("Failed to comment", err)
            // Revert optimistic update on failure
            setComments((prev) => prev.filter((c) => c.id !== tempComment.id))
            setCommentCount((c) => Math.max(0, c - 1))
            onCommentDelta?.(postId, -1)
        }
    }

    const toggleReaction = useCallback(async () => {
        const postId: string = (post as any)._id || (post as any).id
        const next = userReactionState === "like" ? "unlike" : "like"

        // Optimistic update
        setUserReactionState(next === "like" ? "like" : undefined)
        setReactionCount((c) => Math.max(0, c + (next === "like" ? 1 : -1)))

        try {
            if (onReaction) {
                await onReaction(postId, next)
            } else {
                if (next === "unlike") {
                    await apiClient.removeReactionFromPost(postId)
                } else {
                    await apiClient.addReactionToPost(postId)
                }
            }
            onReactionUpdate?.(postId, next)
        } catch (err) {
            console.error("Failed to react", err)
            // Revert optimistic update on failure
            setUserReactionState((prev) => (prev === "like" ? undefined : "like"))
            setReactionCount((c) => Math.max(0, c + (next === "like" ? -1 : 1)))
        }
    }, [onReaction, onReactionUpdate, post, userReactionState])

    const handleShare = () => {
        try {
            if (onShare) {
                onShare()
                return
            }
            const url = typeof window !== "undefined" ? window.location.href : ""
            if (!url) return
            if (navigator.share) {
                navigator.share({ title: (post as any).title || "Community Post", url }).catch(() => {
                    if (navigator.clipboard) navigator.clipboard.writeText(url)
                })
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(url)
            }
        } catch (err) {
            console.error("Share failed", err)
        }
    }

    const toggleCommentReaction = async (commentId: string) => {
        const comment = getCommentById(comments, commentId)
        if (!comment) return

        const userLiked = comment.reactions?.some(r =>
            r.type === 'like' && ((r.user?.id === user.id) || (r.userId === user.id))
        ) || false

        // Optimistic update
        setComments(prev => mapCommentsDeep(prev, c => {
            const cid = c.id || c._id
            if (cid === commentId) {
                const newReactions = userLiked
                    ? (c.reactions?.filter(r => !(r.type === 'like' && ((r.user?.id === user.id) || (r.userId === user.id)))) || [])
                    : [...(c.reactions || []), { type: 'like' as const, user: { id: user.id }, userId: user.id }]
                return { ...c, reactions: newReactions }
            }
            return c
        }))

        try {
            await apiClient.toggleReaction({
                targetType: 'comment',
                targetId: commentId,
                reactionType: 'like'
            })
        } catch (err) {
            console.error("Failed to toggle comment reaction", err)
            // Revert optimistic update
            setComments(prev => mapCommentsDeep(prev, c => {
                const cid = c.id || c._id
                if (cid === commentId) {
                    const newReactions = !userLiked
                        ? (c.reactions?.filter(r => !(r.type === 'like' && ((r.user?.id === user.id) || (r.userId === user.id)))) || [])
                        : [...(c.reactions || []), { type: 'like' as const, user: { id: user.id }, userId: user.id }]
                    return { ...c, reactions: newReactions }
                }
                return c
            }))
        }
    }

    const handleReply = async (parentCommentId: string) => {
        const content = replyText.trim()
        if (!content) return

        const postId: string = (post as any)._id || (post as any).id
        const tempReply: CommentItem = {
            id: `temp-reply-${Math.random().toString(36).slice(2)}`,
            content,
            createdAt: new Date().toISOString(),
            author: { id: user.id, name: user.name, avatar: user.image },
            replies: [],
            reactions: []
        }

        // Optimistic update - add reply to parent comment (supports nested parents)
        setComments(prev => mapCommentsDeep(prev, c => {
            const cid = c.id || c._id
            if (cid === parentCommentId) {
                return { ...c, replies: [...(c.replies || []), tempReply] }
            }
            return c
        }))
        
        setReplyText("")
        setReplyingTo(null)
        // Increment total comment count in parent immediately for a reply too
        onCommentDelta?.(postId, 1)

        try {
            await apiClient.createComment({ 
                content, 
                postId, 
                parentCommentId 
            })
            // Attempt to replace the temp reply with the server-provided one
            // Since response from create reply may vary, do a light refresh of the specific branch by re-fetching comments
            const res = await apiClient.getComments(postId, { limit: 50, sort: 'recent' })
            if (!res?.error) {
                const payload = res?.data as any
                const arr = extractCommentsArray(payload) || []
                const normalized = arr.map((c: any) => normalizeComment(c))
                setComments(normalized)
                // Reconcile with server count
                refreshCommentCount()
            }
        } catch (err) {
            console.error("Failed to reply", err)
            const message = (err as any)?.message || 'Failed to reply'
            toast({
                title: 'Reply failed',
                description: typeof message === 'string' ? message : 'Please try again.',
                variant: 'destructive'
            })
            // Revert optimistic update (nested aware)
            setComments(prev => mapCommentsDeep(prev, c => {
                const cid = c.id || c._id
                if (cid === parentCommentId) {
                    return { ...c, replies: (c.replies || []).filter(r => r.id !== tempReply.id) }
                }
                return c
            }))
            onCommentDelta?.(postId, -1)
        }
    }

    const toggleRepliesExpanded = (commentId: string) => {
        setExpandedReplies(prev => {
            const newSet = new Set(prev)
            if (newSet.has(commentId)) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })
    }

    const renderComment = (comment: CommentItem, depth: number = 0): React.ReactElement => {
        const cid = comment.id || comment._id || Math.random().toString(36)
        const cname = comment.author?.name || "User"
        const cimg = comment.author?.avatar ? getImageUrl(comment.author.avatar) : ""
        const ctime = formatRelativeTime(comment.createdAt)
        const reactionCount = comment.reactions?.filter(r => r.type === 'like').length || 0
        const userLiked = comment.reactions?.some(r => 
            r.type === 'like' && ((r.user?.id === user.id) || (r.userId === user.id))
        ) || false
        const hasReplies = comment.replies && comment.replies.length > 0
        const isExpanded = expandedReplies.has(cid)
        
        return (
            <li key={cid} className={`py-3 sm:py-4 border-b last:border-b-0 ${depth > 0 ? 'ml-6 sm:ml-8 border-l-2 border-l-muted pl-4' : ''}`}>
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                        {cimg ? <AvatarImage src={cimg} alt={cname} /> : null}
                        <AvatarFallback className="text-xs">{(cname || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-sm">{cname}</span>
                            {ctime ? <span className="text-xs text-muted-foreground">{ctime}</span> : null}
                        </div>
                        {comment.content ? (
                            <p className="mt-1 text-sm leading-6 text-foreground/90 whitespace-pre-wrap break-words">{comment.content}</p>
                        ) : null}
                        
                        {/* Comment actions */}
                        <div className="mt-2 flex items-center gap-4">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => toggleCommentReaction(cid)}
                            >
                                <Heart className={`h-3 w-3 mr-1 ${userLiked ? "fill-red-500 text-red-500" : ""}`} />
                                {reactionCount > 0 ? reactionCount : "Like"}
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => setReplyingTo(replyingTo === cid ? null : cid)}
                            >
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                            
                            {hasReplies && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    onClick={() => toggleRepliesExpanded(cid)}
                                >
                                    {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                                    {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                                </Button>
                            )}
                        </div>

                        {/* Reply input */}
                        {replyingTo === cid && (
                            <div className="mt-3 flex items-start gap-2">
                                <Avatar className="h-7 w-7 shrink-0">
                                    {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                                    <AvatarFallback className="text-xs">{(user.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Reply to ${cname}...`}
                                        className="min-h-[60px] text-sm"
                                    />
                                    <div className="mt-2 flex items-center justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            size="sm"
                                            onClick={() => handleReply(cid)}
                                            disabled={!replyText.trim()}
                                        >
                                            <Send className="h-3 w-3 mr-1" /> Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nested replies */}
                        {hasReplies && isExpanded && (
                            <ul className="mt-3 space-y-0">
                                {comment.replies!.map((reply) => renderComment(reply, depth + 1))}
                            </ul>
                        )}
                    </div>
                </div>
            </li>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Avatar className="shrink-0">
                            {avatarSrc ? <AvatarImage src={avatarSrc} alt={authorName} /> : null}
                            <AvatarFallback>{(authorName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-semibold">{authorName}</span>
                                {post.community?.name ? (
                                    <Badge variant="outline" className="text-xs">{post.community.name}</Badge>
                                ) : null}
                                {createdLabel ? (
                                    <span className="text-sm text-muted-foreground">{createdLabel}</span>
                                ) : null}
                            </div>
                            {post.content ? (
                                <p className="text-[0.95rem] leading-7 mb-3 whitespace-pre-wrap break-words text-foreground/95">{post.content}</p>
                            ) : null}

                            {(images.length > 0 || videos.length > 0) && (
                                
                                    <div className={`grid gap-2 ${
                                        images.length + videos.length === 1 ? "grid-cols-1" :
                                        images.length + videos.length === 2 ? "grid-cols-2" :
                                        images.length + videos.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                                    }`}>
                                        {images.map((src, idx) => (
                                            <img
                                                key={`img-${idx}`}
                                                src={getImageUrl(src)}
                                                alt={`Image ${idx + 1} of post by ${authorName}`}
                                                className="w-full h-48 object-cover rounded-md ring-1 ring-border"
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg' }}
                                            />
                                        ))}
                                        {videos.map((src, idx) => (
                                            <video
                                                key={`vid-${idx}`}
                                                src={getImageUrl(src)}
                                                controls
                                                className="w-full h-48 object-cover rounded-md ring-1 ring-border"
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

                            <div className="mt-1 flex flex-wrap gap-2 sm:gap-4">
                                <Button variant="ghost" size="sm" onClick={toggleReaction}>
                                    <Heart className={`h-4 w-4 mr-1 ${userReactionState === "like" ? "fill-red-500 text-red-500" : ""}`} />
                                    {reactionCount}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => commentInputRef.current?.focus()}>
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {commentCount}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleShare}>
                                    <Share2 className="h-4 w-4 mr-1" /> Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                        <Avatar className="shrink-0">
                            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                            <AvatarFallback>{(user.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                ref={commentInputRef}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment…"
                                className="min-h-[72px]"
                            />
                            <div className="mt-2 flex items-center justify-end">
                                <Button onClick={handleSendComment} disabled={!commentText.trim()}>
                                    <Send className="h-4 w-4 mr-2" /> Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground/80">Comments ({commentCount})</h3>
                        {commentCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowComments(!showComments)}
                                className="text-xs"
                            >
                                {showComments ? (
                                    <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Hide Comments
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        Show Comments
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    {showComments && (
                        <>
                            {isLoadingComments ? (
                                <div className="px-4 sm:px-6 py-6 text-sm text-muted-foreground">Loading comments…</div>
                            ) : commentsError ? (
                                <div className="px-4 sm:px-6 py-6 text-sm text-destructive">{commentsError}</div>
                            ) : comments.length === 0 ? (
                                <div className="px-4 sm:px-6 py-6 text-sm text-muted-foreground">No comments yet.</div>
                            ) : (
                                <>
                                    <ul className="px-4 sm:px-6 divide-y">
                                        {(showAllComments ? comments : comments.slice(0, 3)).map((c) => renderComment(c))}
                                    </ul>
                                    {comments.length > 3 && (
                                        <div className="px-4 sm:px-6 py-3 border-t">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => setShowAllComments(!showAllComments)}
                                                className="text-xs w-full"
                                            >
                                                {showAllComments ? (
                                                    <>Show Less Comments</>
                                                ) : (
                                                    <>Show {comments.length - 3} More Comments</>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}