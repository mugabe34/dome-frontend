import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

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
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (name, password) => {
    try {
      const response = await api.post('/auth/login', {
        name,
        password
      })
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
      
      // Wait for 3 seconds minimum
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    
    try {
      const response = await api.post('/auth/register', {
        name,
        password
      })
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setIsProcessing(false)
      return { success: true }
    } catch (error) {
      setIsProcessing(false)
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isProcessing,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

