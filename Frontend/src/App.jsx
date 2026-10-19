import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import UserProfile from './Components/UserProfile'
import {BrowserRouter, Route , Routes , Navigate} from 'react-router-dom'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import HomePage from './Pages/Home'
import ProtectedRoute from './Components/ProtectedRoute'
import SearchResults from './Pages/SearchResults'
import ProfileCard from './Components/ProfileCard'
import ProfileDetails from './Pages/ProfileDetails'
import Matches from './Pages/Matches'
import Messages from './Pages/Messages'
import HeartRequests from './Pages/HeartRequests'

// admin
import AdminRoute from './AdminComponenets/AdminRoute'
import AdminLayout from './AdminComponenets/AdminLayout'
import AdminDashboard from './AdminComponenets/AdminDashboard'
import UserManagement from './AdminComponenets/UserManagement'
import ProfileVerification from './AdminComponenets/ProfileVerfication'
import AdminSettings from './AdminComponenets/AdminSettings'

import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './Components/PageTransition'
function App() {
 return(
  <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    )
}

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                                <Route path="/home" element={<Navigate to="/" replace />} />
                                <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/search-results" element={<PageTransition><SearchResults /></PageTransition>} />
                <Route path="/profilecards" element={<PageTransition><ProfileCard /></PageTransition>} />
                <Route path="/profile/:id" element={<PageTransition><ProfileDetails /></PageTransition>} />

                <Route
                    path="/matches"
                    element={
                        <ProtectedRoute>
                            <PageTransition><Matches /></PageTransition>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    
                    element={
                        <ProtectedRoute>
                            <PageTransition><UserProfile /></PageTransition>
                        </ProtectedRoute>
                    }
                />

                <Route
                        path="/messages"
                        element={
                         <ProtectedRoute>
                        <PageTransition><Messages /></PageTransition>
                        </ProtectedRoute>
                         }
                         />

                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="verification" element={<ProfileVerification />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="/heart-requests" 
                element={<ProtectedRoute>
                    <PageTransition><HeartRequests /></PageTransition>
                    </ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    )
}

export default App
