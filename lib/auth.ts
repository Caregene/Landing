/**
 * Authentication utilities for the test chat system
 */

export interface UserInfo {
  id: string
  email: string
  name: string
  roles: string[]
}

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  userInfo: UserInfo | null
}

/**
 * Get current authentication state
 */
export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      token: null,
      userInfo: null
    }
  }

  const token = localStorage.getItem('authToken')
  const userInfoStr = localStorage.getItem('userInfo')
  
  if (!token || !userInfoStr) {
    return {
      isAuthenticated: false,
      token: null,
      userInfo: null
    }
  }

  try {
    const userInfo = JSON.parse(userInfoStr)
    return {
      isAuthenticated: true,
      token,
      userInfo
    }
  } catch (error) {
    console.error('Error parsing user info:', error)
    return {
      isAuthenticated: false,
      token: null,
      userInfo: null
    }
  }
}

/**
 * Logout user and clear session
 */
export function logout(): void {
  if (typeof window === 'undefined') return
  
  const token = localStorage.getItem('authToken')
  
  // Clear local storage
  localStorage.removeItem('authToken')
  localStorage.removeItem('userInfo')
  
  // Optionally call logout endpoint
  if (token) {
    fetch('http://localhost:8000/api/v1/test/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    }).catch(error => {
      console.error('Logout API call failed:', error)
    })
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated
}

/**
 * Get current user info
 */
export function getCurrentUser(): UserInfo | null {
  return getAuthState().userInfo
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return getAuthState().token
}