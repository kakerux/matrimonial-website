import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutGrid, Users, CheckCircle, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/verification', label: 'Profile Verification', icon: CheckCircle },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const AdminLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="px-6 py-5 border-b border-slate-800">
                    <h1 className="text-lg font-bold">Admin Panel</h1>
                </div>
                <nav className="p-3 space-y-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-end gap-3">
                    {/* <div className="w-9 h-9 rounded-full bg-gray-300" /> */}
                    <span className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
