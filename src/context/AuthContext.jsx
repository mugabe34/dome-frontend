import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setUser(response.data)
      } catch {
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (name, password) => {
    try {
      const response = await api.post('/auth/login', { name, password })
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name, password, showLoader = true) => {
    if (showLoader) {
      setIsProcessing(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))
    }

    try {
      const response = await api.post('/auth/register', { name, password })
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    } finally {
      setIsProcessing(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, isProcessing, login, register, logout }),
    [user, loading, isProcessing]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
