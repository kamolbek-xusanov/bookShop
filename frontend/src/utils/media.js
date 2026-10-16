import { API_URL } from '../services/api'

export const MAX_IMAGES = 5
export const MAX_IMAGE_MB = 5
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// book.images holds paths like "/uploads/abc.jpg" served by the API
export const mediaUrl = (path) => (/^(https?:|blob:|data:)/.test(path) ? path : `${API_URL}${path}`)
