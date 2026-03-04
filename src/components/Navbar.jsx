import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BarChart3, FileText, BellRing, Info, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'
import ThemeToggle from './dashboard/ThemeToggle'

const links = [
  { to: '/', label: 'Tasks', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/notifications', label: 'Alerts', icon: BellRing },
  { to: '/about', label: 'About', icon: Info }
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar-shell hidden md:block">
      <div className="container-shell flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-bold">doME</Link>
        <div className="flex items-center gap-2 lg:gap-3">
          {links.map((link) => {
            const Icon = link.icon
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
                <span className="relative inline-flex">
                  <Icon size={16} />
                  {link.to === '/notifications' && unreadCount > 0 && (
                    <span className="badge-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
          <ThemeToggle />
          <span className="text-sm opacity-75">{user?.name}</span>
          <button onClick={handleLogout} className="btn-danger inline-flex items-center gap-1">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
