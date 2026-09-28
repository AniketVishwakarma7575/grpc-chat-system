export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

const THEME_KEY = 'threadline-theme'

export function getPreferredTheme(): ThemePreference {
  const savedTheme = window.localStorage.getItem(THEME_KEY)
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system'
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference
}

export function persistTheme(theme: ThemePreference): void {
  window.localStorage.setItem(THEME_KEY, theme)
}

export function initializeTheme(): void {
  const preference = getPreferredTheme()
  const theme = resolveTheme(preference, getSystemTheme())
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
}
