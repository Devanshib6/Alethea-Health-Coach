import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000/api/v1'
})

// Add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', config.method, config.url, 'Token:', token ? 'Yes' : 'No') // Debug
    return config
}, (error) => {
    return Promise.reject(error)
})

export const loginUser = async (email, password) => {
    const response = await API.post('/auth/login', { email, password })
    console.log('Login response:', response.data) // Debug
    return response.data
}

export const registerUser = async (full_name, email, password) => {
    const response = await API.post('/auth/register', { full_name, email, password })
    return response.data
}

export const getMyProfile = async () => {
    const response = await API.get('/users/me')
    return response.data
}

export default API