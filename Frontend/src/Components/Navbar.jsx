import { useState, useEffect } from 'react'
import { Link , NavLink} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSocket } from '../socketClient'
import BrowseProfilesMenu from './BrowseProfilesMenu'

const Navbar = () => {
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const fetchPendingCount = () => {
        const token = localStorage.getItem('token')
        axios
            .get('http://localhost:3000/hearts/received', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setPendingCount(res.data.length))
            .catch(() => {})
    }

    useEffect(() => {
        if (!user) return
        fetchPendingCount()
    }, [user])

    // live updates via socket — no more waiting for a page refresh to see a new heart
    useEffect(() => {
        const socket = getSocket()
        if (!socket) return

        const handleNewHeart = () => fetchPendingCount()
        const handleNewMatch = () => toast.success("It's a match! 💕 Check your Matches page.")

        socket.on('newHeart', handleNewHeart)
        socket.on('newMatch', handleNewMatch)
        return () => {
            socket.off('newHeart', handleNewHeart)
            socket.off('newMatch', handleNewMatch)
        }
    }, [])

    return (
        <nav
            className={`sticky top-0 z-40 flex items-center justify-between px-6 sm:px-10 bg-white border-b transition-all duration-300 ${
                scrolled ? 'py-2.5 shadow-md border-pink-100' : 'py-4 border-pink-100'
            }`}
        >
            <NavLink to="/" className="flex items-center gap-2">
                <span className="font-bold text-lg text-pink-600">Shaadi.com</span>
            </NavLink>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                <NavLink to="/" 
                end
                className={({ isActive }) => isActive ? 'text-pink-600 font-semibold' : 'hover:text-pink-600 transition-colors'}>Home</NavLink>
                <BrowseProfilesMenu />
                <NavLink to="/matches"
                 className={({ isActive }) => isActive ? 'text-pink-600 font-semibold' : 'hover:text-pink-600 transition-colors'}>Matches</NavLink>
                <NavLink to="/messages" className={({ isActive }) => isActive ? 'text-pink-600 font-semibold' : 'hover:text-pink-600 transition-colors'}>Messages</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-pink-600 font-semibold' : 'hover:text-pink-600 transition-colors'}>Profile</NavLink>
            </div>

            {user ? (
                <div className="flex items-center gap-3">
                    <Link to="/heart-requests" className="relative p-2 rounded-full hover:bg-pink-50 transition-colors">
                        <Heart className="w-5 h-5 text-pink-600" />
                        {pendingCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {pendingCount > 9 ? '9+' : pendingCount}
                            </span>
                        )}
                    </Link>
                    <span className="text-sm font-semibold text-gray-800">Hi, {user.name}</span>
                    <button
                        onClick={logout}
                        className="text-sm font-semibold text-pink-600 border border-pink-300 rounded-full px-4 py-1.5 hover:bg-pink-50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-semibold text-pink-600 border border-pink-300 rounded-full px-4 py-1.5 hover:bg-pink-50 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="text-sm font-semibold text-white bg-pink-600 rounded-full px-4 py-1.5 hover:bg-pink-700 transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar
