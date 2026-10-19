import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const StatCard = ({ label, value, icon: Icon, sublabel, tone }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{label}</p>
            <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sublabel && (
            <p className={`text-xs mt-1 ${tone === 'orange' ? 'text-orange-500' : 'text-green-600'}`}>{sublabel}</p>
        )}
    </div>
)

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [growth, setGrowth] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        Promise.all([
            axios.get('http://localhost:3000/admin/stats', { headers }),
            axios.get('http://localhost:3000/admin/user-growth', { headers }),
        ])
            .then(([statsRes, growthRes]) => {
                setStats(statsRes.data)
                setGrowth(growthRes.data)
            })
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-gray-400">Loading dashboard...</p>
    if (!stats) return <p className="text-gray-400">Unable to load dashboard data.</p>

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} />
                <StatCard label="Active Profiles" value={stats.activeProfiles.toLocaleString()} icon={CheckCircle2} />
                <StatCard
                    label="Pending Verification"
                    value={stats.pendingVerification.toLocaleString()}
                    icon={AlertCircle}
                    sublabel={stats.pendingVerification > 0 ? 'Requires attention' : undefined}
                    tone="orange"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">User Growth</h2>
                {growth.length === 0 ? (
                    <p className="text-gray-400 text-sm">Not enough signup history yet to show a trend.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={growth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#e11d48" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
