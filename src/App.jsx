import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import MobileHeader from './components/MobileHeader'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'
import Login from './pages/Login'
import Register from './pages/Register'
import WorkspacePage from './pages/WorkspacePage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReportsPage from './pages/ReportsPage'
import NotificationsPage from './pages/NotificationsPage'
import About from './pages/About'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader redirect={false} />
  }

  return user ? children : <Navigate to="/login" replace />
}

const PrivateLayout = ({ children }) => (
  <>
    <Navbar />
    <MobileHeader />
    {children}
    <Footer />
    <MobileTabBar />
  </>
)

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <WorkspacePage />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <AnalyticsPage />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <ReportsPage />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <NotificationsPage />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navigate to="/" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <About />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  )
}

export default App
