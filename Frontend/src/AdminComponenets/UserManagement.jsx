import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchUsers = () => {
        setLoading(true)
        axios
            .get('http://localhost:3000/admin/users', { headers })
            .then((res) => setUsers(res.data))
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoading(false))
    }

    useEffect(fetchUsers, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user and their profile? This cannot be undone.')) return
        try {
            await axios.delete(`http://localhost:3000/admin/users/${id}`, { headers })
            setUsers((prev) => prev.filter((u) => u._id !== id))
            toast.success('User deleted')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to delete user')
        }
    }

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">Photo</th>
                            <th className="px-5 py-3 font-medium">Name</th>
                            <th className="px-5 py-3 font-medium">Email</th>
                            <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="px-5 py-6 text-gray-400 text-center">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={4} className="px-5 py-6 text-gray-400 text-center">No users yet.</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id} className="border-t border-gray-100">
                                    <td className="px-5 py-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
                                            {u.photoUrl && (
                                                <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-800 font-medium">{u.name}</td>
                                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-3">
                                            {u.profileId ? (
                                                <Link
                                                    to={`/profile/${u.profileId}`}
                                                    className="text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg px-3 py-1.5 hover:bg-rose-50 transition-colors"
                                                >
                                                    View Profile
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-300">No profile yet</span>
                                            )}
                                            <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement
