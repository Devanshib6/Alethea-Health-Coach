import API from './api'

export const getAdminStats = async () => {
    const response = await API.get('/admin/stats')
    return response.data
}

export const getAllUsers = async () => {
    const response = await API.get('/admin/users')
    return response.data
}

export const deleteUser = async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`)
    return response.data
}