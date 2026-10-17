import api from './api'

export const registerUser = (user) => api.post('/users/register', user)

export const loginUser = (credentials) => api.post('/users/login', credentials)

export const getProfile = async () => (await api.get('/users/profile')).data.user

export const googleAuth = (credential) => api.post('/users/google', { credential })
