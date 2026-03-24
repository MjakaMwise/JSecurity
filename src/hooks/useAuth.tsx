import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserRole } from '@/api/users'

// Mock users for development (no backend required)
const MOCK_USERS: Record<string, { password: string; role: UserRole; email: string }> = {
  editor:     { password: 'password123', role: 'editor',      email: 'editor@jsecurity.co.ke' },
  admin:      { password: 'password123', role: 'admin',       email: 'admin@jsecurity.co.ke' },
  superadmin: { password: 'password123', role: 'super_admin', email: 'super@jsecurity.co.ke' },
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  setupMFA: () => Promise<any>
  verifyMFA: (token: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

interface AuthUser {
  id?: number
  username?: string
  email?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userRole = localStorage.getItem('userRole') as UserRole | null
    
    if (token && userRole) {
      setUser({
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        role: userRole,
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const mock = MOCK_USERS[username]
      if (!mock || mock.password !== password) {
        throw new Error('Invalid username or password')
      }
      const authUser = { username, email: mock.email, role: mock.role }
      localStorage.setItem('accessToken', 'mock-token')
      localStorage.setItem('userRole', mock.role)
      localStorage.setItem('username', username)
      localStorage.setItem('email', mock.email)
      setUser(authUser)
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const setupMFA = async () => {
    return { qr_code: '', secret: '' }
  }

  const verifyMFA = async (_token: string) => {
    // No-op in mock mode
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    setUser(null)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    
    // Role hierarchy: editor < admin < super_admin
    const hierarchy: Record<UserRole, number> = {
      editor: 1,
      admin: 2,
      super_admin: 3,
    }
    return hierarchy[user.role] >= hierarchy[role]
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    setupMFA,
    verifyMFA,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
