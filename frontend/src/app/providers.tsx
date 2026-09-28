import { useEffect, useState, type ReactNode } from 'react'
import { GooeyToaster } from '../lib/toast'
import {
  getPreferredTheme,
  getSystemTheme,
  persistTheme,
  resolveTheme,
  type ThemePreference,
} from '../lib/theme'
import { ThemeContext } from './theme-context'

export function AppProviders({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(getPreferredTheme)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const theme = resolveTheme(preference, systemTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
  }, [theme])

  const setPreferenceAndPersist = (next: ThemePreference) => {
    persistTheme(next)
    setPreference(next)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <ThemeContext.Provider value={{ preference, theme, setPreference: setPreferenceAndPersist }}>
      {children}
      <GooeyToaster
        position={isMobile ? 'top-center' : 'top-right'}
        theme={theme}
        preset="subtle"
        maxQueue={4}
        queueOverflow="drop-oldest"
        spring={!reducedMotion}
        closeOnEscape
      />
    </ThemeContext.Provider>
  )
}
