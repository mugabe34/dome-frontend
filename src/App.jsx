import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

function AppContent() {
  const { loading } = useAuth()

  // Show a 3s splash loader before auth screens
  const [splashDone, setSplashDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!splashDone) {
    return <Loader redirect={false} durationMs={3000} />
  }

  if (loading) return <Loader redirect={false} />

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Animated Background Blur Effects */}
      <div className="background-blur background-blur-1"></div>
      <div className="background-blur background-blur-2"></div>
      <div className="background-blur background-blur-3"></div>
      
      <div className="relative z-10">
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Tasks />
                <Footer />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
                <Footer />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            </PrivateRoute>
          }
        />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

