const KEY = 'theme'

const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false

// the saved choice, or the system setting when the user never picked one
export function getTheme() {
  const saved = localStorage.getItem(KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return prefersDark() ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0a09' : '#faf8f4')
}

export function saveTheme(theme) {
  localStorage.setItem(KEY, theme)
}

export const hasSavedTheme = () => localStorage.getItem(KEY) !== null
export { prefersDark }
