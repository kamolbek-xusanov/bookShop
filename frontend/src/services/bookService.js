import api from './api'

const API = '/books'

export const getBooks = async ({ page = 1, limit = 9, search = '', sort } = {}) => {
  const { data } = await api.get(API, {
    params: { page, limit, ...(search ? { search } : {}), ...(sort ? { sort } : {}) },
  })
  return data
}

function toFormData({ newImages = [], removeImages = [], ...fields }) {
  const form = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, String(value))
    }
  })
  newImages.forEach((file) => form.append('images', file))
  removeImages.forEach((path) => form.append('removeImages', path))

  return form
}

export const createBook = async (book) => (await api.post(API, toFormData(book))).data

export const updateBook = async ({ id, book }) => (await api.put(`${API}/${id}`, toFormData(book))).data

export const removeBook = async (id) => (await api.delete(`${API}/${id}`)).data


export const getBookById = async (id) => {
  const { data } = await api.get(`${API}/${id}`)
  return data
}
