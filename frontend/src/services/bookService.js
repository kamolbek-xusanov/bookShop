import api from './api'

const API = '/books'

// returns { books, pagination }
export const getBooks = async ({ page = 1, limit = 9, search = '', sort } = {}) => {
  const { data } = await api.get(API, {
    params: { page, limit, ...(search ? { search } : {}), ...(sort ? { sort } : {}) },
  })
  return data
}

// Books are sent as multipart form data, because they can carry up to 5 image files.
//   newImages    - File objects to upload
//   removeImages - stored paths (book.images) to delete while editing
function toFormData({ newImages = [], removeImages = [], ...fields }) {
  const form = new FormData()

  Object.entries(fields).forEach(([key, value]) => form.append(key, String(value)))
  newImages.forEach((file) => form.append('images', file))
  removeImages.forEach((path) => form.append('removeImages', path))

  return form
}

export const createBook = async (book) => (await api.post(API, toFormData(book))).data

export const updateBook = async ({ id, book }) => (await api.put(`${API}/${id}`, toFormData(book))).data

export const removeBook = async (id) => (await api.delete(`${API}/${id}`)).data
