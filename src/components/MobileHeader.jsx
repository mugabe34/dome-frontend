import { Link, useNavigate } from 'react-router-dom'
import { BellRing, LogOut, UserCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'
import ThemeToggle from './dashboard/ThemeToggle'

const MobileHeader = () => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar-shell md:hidden">
      <div className="container-shell py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="text-lg font-bold">doME</Link>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="btn-secondary relative inline-flex items-center gap-1 text-xs px-3 py-2">
              <BellRing size={13} />
              Alerts
              {unreadCount > 0 && <span className="badge-count">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-sm opacity-85 min-w-0">
            <UserCircle2 size={16} />
            <span className="truncate max-w-[180px]">{user?.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="btn-danger inline-flex items-center gap-1 text-xs px-3 py-2">
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default MobileHeader
