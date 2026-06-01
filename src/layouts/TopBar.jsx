import { Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ROUTE_TITLES } from '../constants/routes'
import { useTheme } from '../context/ThemeContext'

export default function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const pageTitle = ROUTE_TITLES[pathname] ?? 'PrepTrack'
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <header className="topbar">
      <p className="topbar__title">{pageTitle}</p>
      <button
        type="button"
        className="topbar__theme-btn"
        onClick={toggleTheme}
        aria-label={`Switch to ${nextTheme} mode`}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </header>
  )
}
