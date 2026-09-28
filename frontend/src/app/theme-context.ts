import { createContext } from 'react'
import type { ThemePreference, ResolvedTheme } from '../lib/theme'

export interface ThemeContextValue {
  preference: ThemePreference
  theme: ResolvedTheme
  setPreference: (theme: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
