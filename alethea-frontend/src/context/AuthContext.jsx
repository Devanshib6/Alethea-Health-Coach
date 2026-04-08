import { createContext, useContext, useState, useEffect } from 'react'
import { getMyProfile } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log('Token on load:', token) // Debug
        
        if (token) {
            getMyProfile()
                .then((data) => {
                    console.log('Profile loaded:', data) // Debug
                    setUser(data)
                })
                .catch((error) => {
                    console.error('Profile error:', error)
                    localStorage.removeItem('token')
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = (token, userData) => {
        console.log('Login called with token:', token) // Debug
        localStorage.setItem('token', token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)