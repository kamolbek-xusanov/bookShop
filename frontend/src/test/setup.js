import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../services/i18n'

// tests read English texts
i18n.changeLanguage('en')

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom has no object URLs (used for image previews)
URL.createObjectURL = vi.fn(() => `blob:test-${Math.random()}`)
URL.revokeObjectURL = vi.fn()
