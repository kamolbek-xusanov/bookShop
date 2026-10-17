import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { applyTheme, getTheme, hasSavedTheme, prefersDark, saveTheme } from '../utils/theme'

const listeners = new Set()
let current = null

function read() {
  if (current === null) current = getTheme()
  return current
}

function set(theme) {
  current = theme
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light')

  useEffect(() => {
    applyTheme(read())

    // follow the system theme until the user picks one by hand
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    const onChange = () => !hasSavedTheme() && set(prefersDark() ? 'dark' : 'light')
    media?.addEventListener('change', onChange)
    return () => media?.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next = read() === 'dark' ? 'light' : 'dark'
    saveTheme(next)
    set(next)
  }, [])

  return { theme, isDark: theme === 'dark', toggle }
}
