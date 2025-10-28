import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Sparkles, Menu, LogOut } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showTooltip, setShowTooltip] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowProfileMenu(false)
  } 

  const isActive = (path) => location.pathname === path

  const linkClasses = (path) =>
    `font-medium transition duration-300 py-2 px-1 
    ${isActive(path)
      ? 'text-indigo-300 border-b-2 border-indigo-400 font-semibold shadow-indigo-400/50 shadow-sm'
      : 'text-gray-300 hover:text-indigo-400 hover:border-b-2 hover:border-indigo-600'
    }`
  
  const NavLinks = () => (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
      <Link to="/" className={linkClasses('/')}>
        Tasks
      </Link>
      <Link to="/dashboard" className={linkClasses('/dashboard')}>
        Dashboard
      </Link>
      <Link to="/about" className={linkClasses('/about')}>
        About
      </Link>
    </div>
  )

  return (
    <nav className="bg-blue-950 text-white shadow-2xl shadow-blue-950/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-indigo-400 hover:text-indigo-300 transition duration-300">
            doMe
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Primary Navigation Links */}
            <div className="flex items-center space-x-6">
              <NavLinks />
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all transform hover:scale-[1.05] duration-300 shadow-xl shadow-indigo-600/50 border border-indigo-700 hover:shadow-2xl"
              >
                <User size={20} className="text-indigo-200" />
                <span className="hidden sm:inline">{user?.name || 'Guest'}</span>
              </button>
              
              {/* Tooltip */}
              {showTooltip && !showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-1 shadow-2xl border border-indigo-500 transform origin-top-right z-50">
                  <Sparkles size={14} className="text-yellow-300" />
                  Pro tips
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[200px] z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{user?.name ? 'Logged in' : 'Guest mode'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-4 py-3 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Login</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <button 
            className="md:hidden text-gray-300 hover:text-indigo-400 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={28} /> {/* Increased icon size for mobile */}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Conditionally Rendered) */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800 px-6 py-3 space-y-3 transition-all duration-300 ease-in-out">
          <NavLinks />
          <div className="pt-2">
            <button
              className="flex items-center space-x-2 bg-indigo-600 w-full justify-center px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              <User size={20} className="text-indigo-200" />
              <span>{user?.name || 'Guest'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
