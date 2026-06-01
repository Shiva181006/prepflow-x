import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'theme'

const ThemeContext = createContext(null)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'dark' || stored === 'light' ? stored : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore theme persistence failures
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
