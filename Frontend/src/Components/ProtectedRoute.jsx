import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    // wait for the initial localStorage check to finish before deciding —
    // without this, a valid session gets wrongly redirected on every refresh
    if (loading) return null

    if (!user) return <Navigate to="/signup" replace />

    return children
}

export default ProtectedRoute
