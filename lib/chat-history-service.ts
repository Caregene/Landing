/**
 * Chat Service for managing chat history with PostgreSQL backend
 */

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_activity?: string;
  first_user_message?: string;
}

interface ChatResponse {
  message: Message;
  session: ChatSession;
  is_new_session: boolean;
}

interface RecentChatsResponse {
  sessions: ChatSession[];
  total_count: number;
  page: number;
  page_size: number;
}

interface ChatSessionWithMessages extends ChatSession {
  messages: Message[];
}

class ChatHistoryService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000/api/v1/chat') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    const fullUrl = `${this.baseUrl}${endpoint}`;
    
    console.log('Making request to:', fullUrl);
    console.log('Auth token present:', !!token);
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { detail: errorText || 'Request failed' };
        }
        
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  }

  /**
   * Start a new chat or continue existing session
   */
  async startChat(message: string, sessionId?: string): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/start', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });
  }

  /**
   * Send a message to an existing chat session
   */
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/message', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message,
      }),
    });
  }

  /**
   * Get recent chat sessions for the sidebar
   */
  async getRecentChats(limit: number = 20, skip: number = 0): Promise<RecentChatsResponse> {
    return this.makeRequest<RecentChatsResponse>(
      `/recent?limit=${limit}&skip=${skip}`
    );
  }

  /**
   * Get a specific chat session with all messages
   */
  async getSession(sessionId: string): Promise<ChatSessionWithMessages> {
    return this.makeRequest<ChatSessionWithMessages>(`/session/${sessionId}`);
  }

  /**
   * Update session title (for when implementing editable titles)
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    await this.makeRequest(`/session/${sessionId}/title`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.makeRequest(`/session/${sessionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Archive a chat session
   */
  async archiveSession(sessionId: string): Promise<void> {
    await this.makeRequest(`/session/${sessionId}/archive`, {
      method: 'POST',
    });
  }
}

// Create singleton instance
const chatHistoryService = new ChatHistoryService();

export { chatHistoryService, type ChatResponse, type ChatSession, type Message, type RecentChatsResponse, type ChatSessionWithMessages };