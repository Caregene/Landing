// API Configuration and Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  isNetworkError?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  role?: string;
}

// Community creation interface - only fields needed during creation
export interface CreateCommunityData {
  title: string;
  description: string;
  location: {
    region: string;
    state?: string;
  };
  tags: string[];  // Genetic conditions
  isPrivate?: boolean;
  settings?: {
    allowMemberPosts?: boolean;
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
  };
}

// Full community interface - includes all fields after creation
export interface Community {
  _id: string;
  title: string;
  description: string;
  slug: string;
  location: {
    region: string;
    state?: string;
  };
  tags: string[];  // Genetic conditions
  isPrivate: boolean;
  
  // Fields added after creation
  memberCount: number;
  lastActivity: string;
  posts: number;
  admins: User[];
  createdBy: User;
  members?: User[];
  
  // Optional fields
  coverImage?: string;
  settings?: {
    allowMemberPosts?: boolean;
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  community: {
    _id: string;
    name: string;
    slug: string;
    avatar?: string;
  };
  images?: string[];
  videos?: string[];
  attachments?: any[];
  tags?: string[];
  reactions: any[]; // Array of reaction objects
  comments?: any[]; // Array of comment objects
  stats: {
    totalReactions: number;
    totalComments: number;
    views: number;
  };
  isPinned: boolean;
  isHidden: boolean;
  // Some backends return `anonymous`, others `isAnonymous`. Support both.
  anonymous?: boolean;
  isAnonymous?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMetrics {
  totalMembers: number;
  totalPosts: number;
  totalViews: number;
  totalReactions: number;
  weeklyGrowth: number;
  activeMembers: number;
  recentActivity: Array<{
    action: string;
    user: string;
    time: string;
  }>;
  memberRetention: number;
  postEngagement: number;
  communityHealth: number;
  memberSatisfaction: number;
  contentQuality: number;
  postsThisWeek: number;
  commentsThisWeek: number;
  activeMembersToday: number;
}

export type NotificationType = 
  | 'post_liked'
  | 'comment_reply'
  | 'post_comment'
  | 'community_invite'
  | 'join_request_accepted'
  | 'join_request_rejected'
  | 'new_member'
  | 'mention'
  | 'friend_request';

export interface Notification {
  _id: string;
  recipient: User;
  sender: User;
  type: NotificationType;
  message: string;
  data: {
    postId?: string;
    commentId?: string;
    communityId?: string;
    inviteId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  unreadCount: number;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  replies: Comment[];
  reactions: {
    type: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
    user: User;
    createdAt: string;
  }[];
  isEdited: boolean;
  editedAt?: string;
  // Support anonymous flags from backend
  anonymous?: boolean;
  isAnonymous?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Friendship {
  _id: string;
  requester: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: (User & { role: 'admin' | 'member' })[];
  lastMessage?: {
    content: string;
    sender: User;
    timestamp: string;
    type: 'text' | 'image' | 'file';
  };
  settings: {
    isArchived: boolean;
    isMuted: boolean;
    allowInvites: boolean;
  };
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }[];
  replyTo?: {
    _id: string;
    content: string;
    sender: User;
  };
  readBy: {
    user: string;
    readAt: string;
  }[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock user data for development (can be overridden via env)
const getMockUser = (): User => ({
  id: process.env.NEXT_PUBLIC_MOCK_USER_ID || '66b1e5c8f1d2a3b4c5d6e7f8',
  name: process.env.NEXT_PUBLIC_MOCK_USER_NAME || 'John Doe',
  email: process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || 'john.doe@example.com',
  avatar: process.env.NEXT_PUBLIC_MOCK_USER_AVATAR || '/placeholder-user.jpg',
  username: process.env.NEXT_PUBLIC_MOCK_USER_USERNAME || 'johndoe',
  role: process.env.NEXT_PUBLIC_MOCK_USER_ROLE || 'member',
});

class ApiClient {
  private baseURL: string;
  private concurrencyLimit: number;
  private runningRequests: number;
  private requestQueue: Array<() => void>;
  private pendingRequests: Map<string, Promise<any>>;
  // Rate limiting removed for simplicity

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.concurrencyLimit = Number(process.env.NEXT_PUBLIC_MAX_CONCURRENT_REQUESTS || 6);
    this.runningRequests = 0;
    this.requestQueue = [];
    this.pendingRequests = new Map();
  }

  private getRequestKey(endpoint: string, options: RequestInit = {}): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  // Rate limiting disabled: no-op

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        this.runningRequests++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.runningRequests--;
            const next = this.requestQueue.shift();
            if (next) next();
          });
      };
      if (this.runningRequests < this.concurrencyLimit) run(); else this.requestQueue.push(run);
    });
  }

  private async withBackoff<T>(fn: () => Promise<T>, max = 2): Promise<T> {
    let delayMs = 400;
    for (let i = 0; i <= max; i++) {
      try {
        return await fn();
      } catch (err: any) {
        const status = err?.status ?? err?.response?.status;
        const isNetworkError = err?.isNetworkError || err?.name === 'TypeError';
        
        // Don't retry network errors (backend not running) or client errors (4xx)
        if (i === max || isNetworkError || (status && status < 500 && status !== 429)) {
          throw err;
        }
        
        const jitter = Math.floor(Math.random() * 200);
        await new Promise((r) => setTimeout(r, delayMs + jitter));
        delayMs *= 2;
      }
    }
    // Should not reach
    throw new Error('Backoff retries exhausted');
  }

  // Health check method to verify backend connectivity
  async checkHealth(): Promise<{ isConnected: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Don't use timeout here to avoid issues, let it fail naturally
      });
      
      if (response.ok) {
        return { isConnected: true };
      } else {
        return { 
          isConnected: false, 
          error: `Server responded with status ${response.status}` 
        };
      }
    } catch (err: any) {
      return { 
        isConnected: false, 
        error: err.name === 'TypeError' && err.message === 'Failed to fetch' 
          ? `Backend server unreachable at ${this.baseURL}`
          : err.message 
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const requestKey = this.getRequestKey(endpoint, options);
    
    // Check if there's already a pending request for this endpoint
    if (this.pendingRequests.has(requestKey)) {
      // Deduplicate identical in-flight requests
      return this.pendingRequests.get(requestKey)!;
    }

    try {
      // Proceed without rate limiting
      const user = getMockUser();
      const disableMockHeaders = process.env.NEXT_PUBLIC_DISABLE_MOCK_HEADERS === 'true';
      
      const exec = async () => {
        try {
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(disableMockHeaders ? {} : {
                'x-user-id': user.id,
                'x-user-name': user.name,
                'x-user-email': user.email,
                'x-user-avatar': user.avatar || '',
                // Avoid sending extra custom headers that may trip CORS
              }),
              ...options.headers,
            },
            ...options,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw Object.assign(new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`), { 
              status: response.status,
              errorData 
            });
          }

          const data = await response.json();
          return { data } as ApiResponse<T>;
        } catch (err: any) {
          // Handle network errors more gracefully
          if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
            // Network error - backend is likely not running
            throw Object.assign(new Error(`Backend server unreachable at ${this.baseURL}. Please ensure the server is running.`), { 
              status: 0, 
              isNetworkError: true,
              originalError: err 
            });
          }
          // Re-throw other errors as-is
          throw err;
        }
      };

      const promise = this.enqueue(() => this.withBackoff(exec));
      
      // Store the promise for deduplication
      this.pendingRequests.set(requestKey, promise);
      
      // Clean up the promise from the map when it resolves or rejects
      promise.finally(() => {
        this.pendingRequests.delete(requestKey);
      });

      return promise;
    } catch (error) {
      const isNetworkError = error instanceof Error && 
        (error.message.includes('Backend server unreachable') || 
         error.message === 'Failed to fetch');
         
      return { 
        error: error instanceof Error ? error.message : 'Network error',
        isNetworkError 
      };
    }
  }

  private async requestFormData<T>(
    endpoint: string,
    formData: FormData,
    options: Omit<RequestInit, 'body'> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const user = getMockUser();
      const disableMockHeaders = process.env.NEXT_PUBLIC_DISABLE_MOCK_HEADERS === 'true';
      const exec = async () => {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: {
            ...(disableMockHeaders ? {} : {
              'x-user-id': user.id,
              'x-user-name': user.name,
              'x-user-email': user.email,
              'x-user-avatar': user.avatar || '',
            }),
            // Don't set Content-Type for FormData - let browser handle it
            ...options.headers,
          },
          body: formData,
          ...options,
        });

        const data = await response.json();

        if (!response.ok) {
          throw Object.assign(new Error(data?.error || `HTTP ${response.status}`), { status: response.status });
        }

        return { data } as ApiResponse<T>;
      };

      return await this.enqueue(() => this.withBackoff(exec));
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Communities API
  async getCommunities(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<ApiResponse<{ communities: Community[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const res = await this.request<{ communities: Community[]; totalPages: number; currentPage: number; total: number }>(`/communities?${queryParams}`);
    if (res.error && /not found|404/i.test(res.error)) {
      return { data: { communities: [], totalPages: 0, currentPage: 1, total: 0 } };
    }
    return res;
  }

  async getUserCommunities(): Promise<ApiResponse<{ communities: (Community & { userRole: 'creator' | 'admin' | 'member' })[]; }>> {
    const res = await this.request<{ communities: (Community & { userRole: 'creator' | 'admin' | 'member' })[]; }>('/communities/user/my-communities');
    if (res.error && /not found|404/i.test(res.error)) {
      return { data: { communities: [] } } as ApiResponse<{ communities: (Community & { userRole: 'creator' | 'admin' | 'member' })[]; }>;
    }
    return res;
  }

  async getCommunity(slug: string): Promise<ApiResponse<Community>> {
    return this.request(`/communities/${slug}`);
  }

  async createCommunity(data: CreateCommunityData): Promise<ApiResponse<Community>> {
    const result = await this.request<Community>('/communities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result;
  }

  async joinCommunity(communityId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/communities/${communityId}/join`, {
      method: 'POST',
    });
  }

  async leaveCommunity(communityId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/communities/${communityId}/leave`, {
      method: 'POST',
    });
  }

  async getCommunityMetrics(communityId: string): Promise<ApiResponse<CommunityMetrics>> {
    return this.request(`/communities/${communityId}/metrics`, {
      method: 'GET',
    });
  }

  // Posts API
  async getPosts(params?: {
    page?: number;
    limit?: number;
    communityId?: string;
    userId?: string;
    sort?: string;
  }): Promise<ApiResponse<{ posts: Post[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/posts?${queryParams}`);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.request(`/posts/${postId}`);
  }

  async createPost(data: {
    title: string;
    content: string;
    communityId: string;
    images?: string[];
    videos?: string[];
    isAnonymous?: boolean;
    link?: { url: string; title?: string; description?: string };
  }): Promise<ApiResponse<Post>> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(postId: string, data: {
    title?: string;
    content?: string;
  }): Promise<ApiResponse<Post>> {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Search API
  async search(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    type?: 'all' | 'communities' | 'posts';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    communities: Community[];
    posts: Post[];
    totalResults: number;
    pagination: {
      communities: { page: number; limit: number; total: number; totalPages: number };
      posts: { page: number; limit: number; total: number; totalPages: number };
    };
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search?${queryParams}`);
  }

  async searchCommunities(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    communities: Community[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const res = await this.request<{ communities: Community[]; total: number; page: number; totalPages: number }>(`/search/communities?${queryParams}`);
    if (res.error && /not found|404/i.test(res.error)) {
      return { data: { communities: [], total: 0, page: 1, totalPages: 0 } };
    }
    return res;
  }

  async searchPosts(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    communityId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search/posts?${queryParams}`);
  }

  // Comments API
  async getComments(postId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<{ comments: Comment[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/posts/${postId}/comments?${queryParams}`);
  }

  // Comment count API for a post
  async getCommentCountForPost(postId: string): Promise<ApiResponse<{ postId: string; commentCount: number }>> {
    return this.request(`/posts/${postId}/comments/count`);
  }

  async createComment(data: {
    content: string;
    postId: string;
    parentCommentId?: string;
    isAnonymous?: boolean;
  }): Promise<ApiResponse<Comment>> {
    return this.request(`/posts/${data.postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content: data.content,
        parentCommentId: data.parentCommentId,
        isAnonymous: data.isAnonymous
      }),
    });
  }

  async updateComment(commentId: string, data: {
    content: string;
  }): Promise<ApiResponse<Comment>> {
    return this.request(`/posts/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(commentId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/posts/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Reactions API (single reaction type: 'like')
  async addReactionToPost(postId: string): Promise<ApiResponse<{ message: string; reactions: any[] }>> {
    return this.request(`/posts/${postId}/reactions`, {
      method: 'POST',
      // Backend expects 'love' for post reactions
      body: JSON.stringify({ type: 'love' }),
    });
  }

  async removeReactionFromPost(postId: string): Promise<ApiResponse<{ message: string; reactions: any[] }>> {
    return this.request(`/posts/${postId}/reactions`, {
      method: 'DELETE',
    });
  }

  async toggleReaction(data: {
    targetType: 'post' | 'comment';
    targetId: string;
    reactionType?: 'like'; // optional; defaults to 'like'
  }): Promise<ApiResponse<{ message: string; reactionCounts: Record<string, number> }>> {
    // Map UI single reaction to backend-specific types
    const backendType = data.targetType === 'post' ? 'love' : 'like';

    // Use the correct endpoint based on target type
    const endpoint = data.targetType === 'post' 
      ? `/posts/${data.targetId}/reactions`
      : `/posts/comments/${data.targetId}/reactions`;
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type: backendType }),
    });
  }

  // Friends API
  async getFriends(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ friendships: Friendship[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/friends?${queryParams}`);
  }

  async searchUsers(params: {
    query?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ 
    users: User[]; 
    totalPages: number; 
    currentPage: number; 
    total: number 
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search/users?${queryParams}`);
  }

  async getAvailableConditions(): Promise<ApiResponse<{ conditions: string[] }>> {
    return this.request('/communities/conditions');
  }

  async getAvailableRegions(): Promise<ApiResponse<{ regions: string[] }>> {
    return this.request('/communities/regions');
  }

  async getAvailableCategories(): Promise<ApiResponse<{ categories: string[] }>> {
    return this.request('/communities/categories');
  }

  async sendFriendRequest(userId: string, data: {
    name: string;
    email: string;
    avatar?: string;
  }): Promise<ApiResponse<Friendship>> {
    return this.request('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId, ...data }),
    });
  }

  async respondToFriendRequest(requestId: string, action: 'accept' | 'decline'): Promise<ApiResponse<Friendship>> {
    return this.request(`/friends/${requestId}/${action}`, {
      method: 'POST',
    });
  }

  async removeFriend(friendshipId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/friends/${friendshipId}`, {
      method: 'DELETE',
    });
  }

  // Messages API
  async getConversations(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<{ conversations: Conversation[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/messages/conversations?${queryParams}`);
  }

  async getMessages(conversationId: string, params?: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
  }): Promise<ApiResponse<{ messages: Message[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/messages/conversations/${conversationId}/messages?${queryParams}`);
  }

  async sendMessage(conversationId: string, data: {
    content: string;
    type?: 'text' | 'image' | 'file';
    attachments?: any[];
    replyToId?: string;
  }): Promise<ApiResponse<Message>> {
    return this.request(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createDirectConversation(data: {
    recipientId: string;
    recipientName: string;
    recipientEmail: string;
    recipientAvatar?: string;
  }): Promise<ApiResponse<Conversation>> {
    return this.request('/messages/conversations/direct', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createGroupConversation(data: {
    name: string;
    participantIds: string[];
    participantData: any[];
  }): Promise<ApiResponse<Conversation>> {
    return this.request('/messages/conversations/group', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload API
  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.requestFormData('/upload/avatar', formData);
  }

  async uploadImages(files: File[]): Promise<ApiResponse<{ images: { url: string; filename: string }[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    return this.requestFormData('/upload/images', formData);
  }

  async uploadFiles(files: File[]): Promise<ApiResponse<{ files: { url: string; filename: string }[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.requestFormData('/upload/files', formData);
  }

  // Notifications API
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<ApiResponse<NotificationResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/notifications?${queryParams}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ modifiedCount: number }>> {
    return this.request('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    return this.request('/notifications/unread-count');
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
