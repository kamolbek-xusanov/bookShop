import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../services/i18n'

i18n.changeLanguage('en')

afterEach(() => {
  cleanup()
  localStorage.clear()
})

URL.createObjectURL = vi.fn(() => `blob:test-${Math.random()}`)
URL.revokeObjectURL = vi.fn()
