import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-400/30 px-3 py-2 text-sm font-semibold"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}

export default ThemeToggle
