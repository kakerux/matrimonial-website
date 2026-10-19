import { createContext, useContext, useState, useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../socketClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // true until we've checked localStorage at least once

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const name = localStorage.getItem('name')
        const gender = localStorage.getItem('gender')
        const religion = localStorage.getItem('religion')
        if (token) {
            setUser({ token, role, name, gender, religion })
            connectSocket(token)
        }
        setLoading(false)
    }, [])

    const login = ({ token, role, name, gender, religion }) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('name', name)
        if (gender) localStorage.setItem('gender', gender)
        if (religion) localStorage.setItem('religion', religion)
        setUser({ token, role, name, gender, religion })
        connectSocket(token)
    }

    const logout = () => {
        localStorage.clear()
        setUser(null)
        disconnectSocket()
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
