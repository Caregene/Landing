"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Video, X, Loader2, Globe, Users, Bookmark, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCreatePost, useUserCommunities } from '../hooks/use-api';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId?: string;
  communityName?: string;
  onPostCreated?: (post: any) => void;
  currentUser?: { name: string; avatar?: string; };
  initialPicker?: 'image' | 'video';
  initialFiles?: File[];
}

export function CreatePostModal({ 
  open, 
  onOpenChange, 
  communityId, 
  communityName,
  onPostCreated,
  currentUser = { name: "You", avatar: "/placeholder-user.jpg" },
  initialPicker,
  initialFiles
}: CreatePostModalProps) {
  const [caption, setCaption] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [conditionSpecific, setConditionSpecific] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [successStory, setSuccessStory] = useState(false);
  const [isFbStyle, setIsFbStyle] = useState(false);
  const [fbBackground,] = useState<string>('bg-gradient-to-r from-blue-600 to-purple-600');
  const [fbTextSize, setFbTextSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('xl');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createPost, loading: creating } = useCreatePost();
  const { communities: userCommunities, loading: loadingCommunities } = useUserCommunities();

  // Derive user initials for fallback avatar
  const userInitials = useMemo(() => {
    const name = currentUser?.name || 'You';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0]!.toUpperCase())
      .slice(0, 2)
      .join('') || 'U';
  }, [currentUser]);

  // Transform API data to match our interface
  const availableCommunities = useMemo(() => {
    return userCommunities.map(community => ({
      id: community._id,
      name: community.title,
      isPrivate: community.isPrivate
    }));
  }, [userCommunities]);

  // Get communities with fallback for the specific communityId
  const communitiesWithFallback = useMemo(() => {
    let communities = availableCommunities;

    // If communityId is provided but not in the list, add it
    if (communityId && communityName && !communities.find((c) => c.id === communityId)) {
      communities = [
        { id: communityId, name: communityName, isPrivate: false },
        ...communities
      ];
    }

    return communities;
  }, [availableCommunities, communityId, communityName]);

  const addFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const remaining = Math.max(0, 10 - selectedFiles.length);
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining);
    setSelectedFiles(prev => [...prev, ...toAdd]);
    // Create preview URLs and track media types
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMediaPreview(prev => [...prev, ev.target?.result as string]);
        setMediaTypes(prev => [...prev, file.type.startsWith('video/') ? 'video' : 'image']);
      };
      reader.readAsDataURL(file);
    });
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    // Reset the input value to allow selecting the same file again
    if (e.target) {
      (e.target as HTMLInputElement).value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
    setMediaTypes(prev => prev.filter((_, i) => i !== index));
  };

  // Submit post: send images/videos as base64 data URLs in JSON payload (no server upload step)
  const handleSubmit = async () => {
    // User must select a community (mandatory)
    if (!selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities') {
      return;
    }

    // User must have either caption text OR media files (at least one)
    if (!caption.trim() && selectedFiles.length === 0) {
      return;
    }

    try {
      // Build base64 data arrays from previews (already generated via FileReader in addFiles)
      const imageBase64s = mediaPreview
        .map((src, idx) => ({ src, type: mediaTypes[idx] }))
        .filter((m) => m.type === 'image')
        .map((m) => m.src);
      const videoBase64s = mediaPreview
        .map((src, idx) => ({ src, type: mediaTypes[idx] }))
        .filter((m) => m.type === 'video')
        .map((m) => m.src);

      // Create post data
      const trimmedCaption = caption.trim();
      
      // Generate a proper title (minimum 5 chars for backend validation)
      let title = trimmedCaption.slice(0, 100) || 'Media Post';
      if (title.length < 5) {
        title = 'Media Post'; // Fallback that meets 5-char minimum
      }
      
      // Ensure content meets minimum 10 characters for backend validation
      let content = trimmedCaption;
      if (content.length < 10) {
        if (selectedFiles.length > 0) {
          content = content ? content + ' - shared via Caregene' : 'Check out this media - shared via Caregene';
        } else {
          content = content + ' - shared via Caregene'; // Add suffix to meet minimum
        }
      }
      
      const postData: any = {
        title: title,
        content: content,
        communityId: selectedCommunity,
        isAnonymous: isAnonymous,
        // Include base64-encoded media directly in payload
        ...(imageBase64s.length > 0 ? { images: imageBase64s } : {}),
        ...(videoBase64s.length > 0 ? { videos: videoBase64s } : {}),
      };

      // Build content decorations: style + tags
      let finalContent = content
      if (isFbStyle) {
        finalContent += `\n\n::fb_style::bg=${fbBackground};size=${fbTextSize}`
      }
      const tags: string[] = []
      if (conditionSpecific) tags.push('condition-specific')
      if (urgent) tags.push('urgent')
      if (successStory) tags.push('success-story')
      if (tags.length) {
        finalContent += `\n\n#${tags.join(' #')}`
      }
      postData.content = finalContent

  const result = await createPost(postData);

      if (result?.data) {
        // Reset form
        setCaption('');
        setSelectedFiles([]);
        setMediaPreview([]);
        setMediaTypes([]);
        setIsAnonymous(false);
        setConditionSpecific(false);
        setUrgent(false);
        setSuccessStory(false);
        setSelectedCommunity(''); // Reset community selection
        onOpenChange(false);
        
        // Call success callback
        onPostCreated?.(result.data);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      // swallow error for now (keep UI minimal); ideally show toast
    }
  };

  const isLoading = creating || loadingCommunities;
  const selectedCommunityData = communitiesWithFallback.find((c) => c.id === selectedCommunity);
  const communityTypeLabel = selectedCommunityData ? (selectedCommunityData.isPrivate ? 'Private' : 'Public') : undefined;

  // Set initial community selection when modal opens
  useEffect(() => {
    if (open && communityId && !selectedCommunity) {
      setSelectedCommunity(communityId);
    }
  }, [open, communityId, selectedCommunity]);

  // If initialPicker is provided, auto-open the respective file chooser when modal opens
  useEffect(() => {
    if (open && initialPicker && fileInputRef.current) {
      fileInputRef.current.accept = initialPicker === 'image' ? 'image/*' : 'video/*'
      // Defer the click slightly to ensure dialog is mounted
      const t = setTimeout(() => fileInputRef.current?.click(), 50)
      return () => clearTimeout(t)
    }
  }, [open, initialPicker])

  // If files are preselected from the page, auto-attach them when modal opens
  useEffect(() => {
    if (open && initialFiles && initialFiles.length > 0) {
      addFiles(initialFiles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialFiles])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border"
        onPointerDownOutside={() => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/95 backdrop-blur-sm">
          <DialogTitle className="text-base sm:text-lg font-semibold text-center">Create Post</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center mt-1">
            Create a new post to share with your community
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {/* User and audience context */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {currentUser?.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : null}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{currentUser?.name || 'You'}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                {communityTypeLabel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/50 text-foreground/80 px-2 py-0.5">
                    {selectedCommunityData?.isPrivate ? (
                      <Users className="h-3.5 w-3.5" />
                    ) : (
                      <Globe className="h-3.5 w-3.5" />
                    )}
                    {communityTypeLabel}
                  </span>
                )}
                {selectedCommunityData?.name && (
                  <Badge variant="outline" className="rounded-full px-2 py-0.5">
                    {selectedCommunityData.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {/* Community selection */}
          <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
          <SelectTrigger className="h-9 text-sm border-border shadow-none focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-2 w-full">
                    {selectedCommunityData && (
                      <>
                        {selectedCommunityData.isPrivate ? (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{selectedCommunityData.name}</span>
                      </>
                    )}
                    {!selectedCommunityData && (
                      <span className="text-muted-foreground">Select a community</span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {loadingCommunities ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading communities...
                      </div>
                    </SelectItem>
                  ) : communitiesWithFallback.length === 0 ? (
                    <SelectItem value="no-communities" disabled>
                      No communities available
                    </SelectItem>
                  ) : (
                    communitiesWithFallback.map((community) => (
                      <SelectItem key={community.id} value={community.id} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          {community.isPrivate ? (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{community.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            
          </div>

          {/* Caption */}
          <Textarea
            placeholder={`Share your experience, ask a question, or offer support...`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[120px] resize-none placeholder:text-muted-foreground/70"
          />

        
          {/* Media actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 hover:bg-accent/50"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Image className="h-4 w-4 mr-2" /> Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 hover:bg-accent/50"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "video/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Video className="h-4 w-4 mr-2" /> Video
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={isLoading || (!caption.trim() && selectedFiles.length === 0) || !selectedCommunity || selectedCommunity === 'loading' || selectedCommunity === 'no-communities' || loadingCommunities}>
                <Send className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          {/* Media preview */}
          {mediaPreview.length > 0 && (
            <div className="border border-border rounded-lg p-3 bg-muted/20">
              <div className={`grid gap-2 ${
                mediaPreview.length === 1 ? 'grid-cols-1' :
                mediaPreview.length === 2 ? 'grid-cols-2' :
                mediaPreview.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {mediaPreview.map((src, index) => (
                  <div key={index} className="relative group">
                    {mediaTypes[index] === 'video' ? (
                      <video src={src} className="w-full h-32 object-cover rounded-lg ring-1 ring-border" controls />
                    ) : (
                      <img src={src} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg ring-1 ring-border" />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
