import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Heart as HeartIcon, X } from 'lucide-react'
import Navbar from '../Components/Navbar'

const HeartRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchRequests = () => {
        setLoading(true)
        axios
            .get('http://localhost:3000/hearts/received', { headers })
            .then((res) => setRequests(res.data))
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoading(false))
    }

    useEffect(fetchRequests, [])

    const handleAccept = async (heartId) => {
        try {
            await axios.put(`http://localhost:3000/hearts/${heartId}/accept`, {}, { headers })
            setRequests((prev) => prev.filter((r) => r.heartId !== heartId))
            toast.success("It's a match! 💕")
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to accept')
        }
    }

    const handleDecline = async (heartId) => {
        try {
            await axios.put(`http://localhost:3000/hearts/${heartId}/decline`, {}, { headers })
            setRequests((prev) => prev.filter((r) => r.heartId !== heartId))
            toast.success('Declined')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to decline')
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Heart Requests</h1>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : requests.length === 0 ? (
                    <p className="text-gray-400">No pending requests right now.</p>
                ) : (
                    <div className="space-y-3">
                        {requests.map((r) => (
                            <div
                                key={r.heartId}
                                className="flex items-center gap-4 bg-white border border-pink-100 rounded-xl p-4"
                            >
                                <div className="w-14 h-14 rounded-full bg-pink-100 overflow-hidden flex-shrink-0">
                                    {r.photoUrl && (
                                        <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{r.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {r.age ? `${r.age} yrs` : ''}{r.age && r.city ? ' · ' : ''}{r.city || ''}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {r.profileId && (
                                        <Link
                                            to={`/profile/${r.profileId}`}
                                            className="text-sm font-semibold text-rose-600 border border-rose-200 rounded-lg px-3 py-2 hover:bg-rose-50 transition-colors"
                                        >
                                            View
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleAccept(r.heartId)}
                                        className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <HeartIcon className="w-4 h-4" />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(r.heartId)}
                                        className="flex items-center gap-1 text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeartRequests
