import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log('Request:', config.method, config.url, 'Token:', token ? 'Present' : 'Missing')
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle response errors
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('Auth error:', error.response?.data)
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const registerUser = async (full_name, email, password) => {
    const response = await api.post('/auth/register', { full_name, email, password })
    return response.data
}

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    console.log('Login response:', response.data)
    
    // Store token
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)
        console.log('Token stored successfully')
    }
    
    return response.data
}

export const getMyProfile = async () => {
    const response = await api.get('/users/me')
    return response.data
}

export const updateProfile = async (data) => {
    const response = await api.put('/users/me', data)
    return response.data
}

export const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
}

export default api