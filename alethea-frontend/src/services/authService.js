import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
})

// Add token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const loginUser = async (email, password) => {
    const response = await API.post('/auth/login', { email, password })
    return response.data
}

export const registerUser = async (full_name, email, password, role = 'user') => {
    const response = await API.post('/auth/register', { full_name, email, password, role })
    return response.data
}

export const getMyProfile = async () => {
    const response = await API.get('/users/me')
    return response.data
}

export const updateProfile = async (userData) => {
    const response = await API.put('/users/me', userData)
    return response.data
}

export const deleteAccount = async () => {
    const response = await API.delete('/users/me')
    return response.data
}

export default API