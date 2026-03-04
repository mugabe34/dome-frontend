import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart3, FileText, BellRing, Info } from 'lucide-react'
import { useNotifications } from '../context/NotificationsContext'

const tabs = [
  { to: '/', label: 'Tasks', icon: LayoutDashboard },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/notifications', label: 'Alerts', icon: BellRing },
  { to: '/about', label: 'About', icon: Info }
]

const MobileTabBar = () => {
  const location = useLocation()
  const { unreadCount } = useNotifications()

  return (
    <nav className="mobile-tabbar md:hidden" aria-label="Mobile navigation">
      <ul className="mobile-tablist five-cols">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = location.pathname === tab.to
          return (
            <li key={tab.to}>
              <Link to={tab.to} className={`mobile-tab ${active ? 'mobile-tab-active' : ''}`}>
                <span className="relative inline-flex">
                  <Icon size={16} />
                  {tab.to === '/notifications' && unreadCount > 0 && (
                    <span className="badge-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileTabBar
