import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'Administrator' | 'Pharmacist' | 'Cashier' | 'Stock Manager'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: { [key: string]: User } = {
  'admin@pharmalink.com': {
    id: '1',
    email: 'admin@pharmalink.com',
    name: 'Dr. Amina Diallo',
    role: 'Administrator'
  },
  'pharmacist@pharmalink.com': {
    id: '2',
    email: 'pharmacist@pharmalink.com',
    name: 'Dr. Ibrahim Kone',
    role: 'Pharmacist'
  },
  'cashier@pharmalink.com': {
    id: '3',
    email: 'cashier@pharmalink.com',
    name: 'Marie Traore',
    role: 'Cashier'
  },
  'stock@pharmalink.com': {
    id: '4',
    email: 'stock@pharmalink.com',
    name: 'Ousmane Bah',
    role: 'Stock Manager'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('pharmalink_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple mock authentication
    const mockUser = mockUsers[email]
    if (mockUser && password === 'password123') {
      setUser(mockUser)
      localStorage.setItem('pharmalink_user', JSON.stringify(mockUser))
    } else {
      throw new Error('Invalid credentials')
    }
    
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pharmalink_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}