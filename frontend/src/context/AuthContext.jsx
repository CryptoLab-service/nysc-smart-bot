import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Helper to setup Axios headers
    const setAuthHeader = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }

    // Fallback if Env Var is missing (Common Vercel issue)
    const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"

    const checkAuth = async () => {
        const token = localStorage.getItem('nysc_token')
        if (token) {
            setAuthHeader(token)
            try {
                // Use API_URL constant
                const res = await axios.get(`${API_URL}/auth/me`)
                setUser(res.data)
            } catch (error) {
                console.error("Auth Validation Failed", error)
                logout()
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { timeout: 60000 })
            const { token, ...userData } = res.data
            localStorage.setItem('nysc_token', token)
            setAuthHeader(token)
            setUser(userData)
            toast.success("Welcome back!")
            return { success: true }
        } catch (error) {
            const msg = error.response?.data?.detail || error.message || "Login failed"
            toast.error(msg)
            return { success: false, error: msg }
        }
    }

    const signup = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, userData, { timeout: 60000 })
            const { token, ...user } = res.data
            localStorage.setItem('nysc_token', token)
            setAuthHeader(token)
            setUser(user)
            toast.success("Account created successfully!")
            return { success: true }
        } catch (error) {
            let errorMessage = "Signup failed";
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    // Start with the first error message
                    errorMessage = detail.map(e => e.msg).join(', ');
                } else {
                    errorMessage = detail;
                }
            }
            toast.error(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    const socialLogin = async (provider) => {
        setLoading(true)
        try {
            // Simulate getting provider data (In a real app, this comes from Firebase/Auth0)
            // For now, we simulate the "Success" from the provider side
            // and send the email/data to our backend to create the session.
            const mockProviderData = {
                email: `user_${Math.floor(Math.random() * 1000)}@${provider.toLowerCase()}.com`,
                name: `${provider} User`,
                provider: provider,
                photo_url: `https://ui-avatars.com/api/?name=${provider}+User`
            }

            const res = await axios.post(`${API_URL}/auth/social-login`, mockProviderData)
            const { token, ...userData } = res.data

            localStorage.setItem('nysc_token', token)
            setAuthHeader(token)
            setUser(userData)
            toast.success(`Welcome back via ${provider}!`)
            setLoading(false)
            return { success: true }
        } catch (error) {
            console.error("Social Login Error", error)
            toast.error("Social login failed. Please try again.")
            setLoading(false)
            return { success: false, error: "Social login connection failed" }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('nysc_token')
        setAuthHeader(null)
    }

    const updateProfile = (updates) => {
        // Implement API call for profile update if needed
        setUser(prev => ({ ...prev, ...updates }))
    }

    const value = {
        user,
        loading,
        login,
        signup,
        socialLogin,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
