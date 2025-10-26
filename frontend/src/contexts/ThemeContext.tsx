import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeType, THEMES, ThemeConfig } from '../config/api'

interface ThemeContextValue {
  theme: ThemeType
  themeConfig: ThemeConfig
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType
    return savedTheme && savedTheme in THEMES ? savedTheme : 'light-grace'
  })

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Apply theme colors as CSS custom properties
    const colors = THEMES[newTheme].colors
    const root = document.documentElement
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-divider', colors.divider)
  }

  const toggleTheme = () => {
    const themes = Object.keys(THEMES) as ThemeType[]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  useEffect(() => {
    setTheme(theme) // Apply theme on mount
  }, [theme])

  const themeConfig = THEMES[theme]

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext