import api from './api'

const API = '/users'

export const getUsers = async () => (await api.get(API)).data

export const createUser = async (user) => (await api.post(API, user)).data

export const updateUser = async ({ id, user }) => (await api.put(`${API}/${id}`, user)).data

export const deleteUser = async (id) => (await api.delete(`${API}/${id}`)).data
