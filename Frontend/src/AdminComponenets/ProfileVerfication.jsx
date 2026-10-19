import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ProfileVerification = () => {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchPending = () => {
        setLoading(true)
        axios
            .get('http://localhost:3000/admin/profiles/pending', { headers })
            .then((res) => setProfiles(res.data))
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoading(false))
    }

    useEffect(fetchPending, [])

    const handleVerify = async (id) => {
        try {
            await axios.put(`http://localhost:3000/admin/profiles/${id}/verify`, {}, { headers })
            setProfiles((prev) => prev.filter((p) => p._id !== id))
            toast.success('Profile verified')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to verify profile')
        }
    }

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-900 mb-6">Profile Verification</h1>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : profiles.length === 0 ? (
                <p className="text-gray-400">No profiles waiting on verification.</p>
            ) : (
                <div className="space-y-3">
                    {profiles.map((profile) => (
                        <div
                            key={profile._id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">{profile.name}</p>
                                <p className="text-sm text-gray-500">
                                    {profile.age} yrs · {profile.city}, {profile.state} · {profile.occupation}
                                </p>
                            </div>
                            <button
                                onClick={() => handleVerify(profile._id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Verify
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfileVerification
