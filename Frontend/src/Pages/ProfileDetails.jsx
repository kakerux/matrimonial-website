import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../Components/Navbar'
import { useAuth } from '../context/AuthContext'


const fieldLabel = 'text-xs font-medium text-rose-500 mb-1'
const fieldBox = 'bg-rose-50 border border-rose-100 rounded-lg px-3 py-2'

const ProfileDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
        const { user } = useAuth()
    
    const [heartSent, setHeartSent] = useState(false)
    const [isMatch, setIsMatch] = useState(false)
    const [heartLoading, setHeartLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setNotFound(false)
        axios
            .get(`http://localhost:3000/profiles/${id}`)
            .then((res) => setProfile(res.data))
            .catch((error) => {
                console.error('Unable to load profile:', error.response?.data)
                setNotFound(true)
            })
            .finally(() => setLoading(false))
    }, [id])

    // once we know which profile this is, check whether we already hearted them
    useEffect(() => {
        if (!profile) return
        const token = localStorage.getItem('token')
        if (!token) return

        axios
            .get(`http://localhost:3000/hearts/status/${profile.UserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setHeartSent(res.data.sent))
            .catch((error) => console.error('Unable to check heart status:', error.response?.data))
    }, [profile])

    const handleSendHeart = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Please create an account to send a heart')
            navigate('/signup')
            return
        }

        setHeartLoading(true)
        try {
            const res = await axios.post(
                `http://localhost:3000/hearts/${profile.UserId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setHeartSent(true)
            if (res.data.isMatch) {
                setIsMatch(true)
                toast.success("It's a match! 💕")
            } else {
                toast.success('Heart sent!')
            }
        } catch (error) {
            console.error('Unable to send heart:', error.response?.data)
            toast.error(error.response?.data?.message || 'Unable to send heart')
        } finally {
            setHeartLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50/40">
                <Navbar />
                <p className="text-center text-gray-400 py-20">Loading profile...</p>
            </div>
        )
    }

    if (notFound || !profile) {
        return (
            <div className="min-h-screen bg-rose-50/40">
                <Navbar />
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">This profile couldn't be found.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-rose-600 font-semibold hover:underline"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-rose-50/40 py-10 px-4">
            <div className="max-w-2xl mx-auto mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-rose-600 font-semibold hover:underline"
                >
                    ← Back
                </button>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 flex gap-5 items-start">
                    <div className="flex-shrink-0 w-28 h-28 rounded-xl bg-rose-100 border-2 border-rose-200 overflow-hidden flex items-center justify-center">
                        {profile.profileImage ? (
                            <img
                                src={`http://localhost:3000/uploads/${profile.profileImage}`}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-rose-400 font-medium">No Photo</span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900 truncate mb-3">{profile.name}</h1>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                            <div>
                                <p className={fieldLabel}>Age</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.age} years</p>
                            </div>
                            <div>
                                <p className={fieldLabel}>Height</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.height} cm</p>
                            </div>
                            <div>
                                <p className={fieldLabel}>Location</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {profile.city}, {profile.state}
                                </p>
                            </div>
                            <div>
                                <p className={fieldLabel}>Education</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.education}</p>
                            </div>
                        </div>

                    
                       <button
                                                   type="button"
                                                   onClick={handleSendHeart}
                                                   disabled={heartSent || heartLoading}
                                                   hidden={user?.role === 'admin'}
                                                   className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                                       heartSent
                                                           ? 'bg-rose-100 text-rose-500 cursor-default'
                                                           : 'bg-gradient-to-r from-rose-600 to-purple-600 text-white hover:opacity-90'
                                                   }`}
                                               >
                                                   <Heart className={`w-4 h-4 ${heartSent ? 'fill-rose-500' : ''}`} />
                                                   {heartLoading ? 'Sending...' : heartSent ? (isMatch ? "It's a Match!" : 'Heart Sent') : 'Send a Heart'}
                                               </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* About */}
                    <section>
                        <h2 className="text-rose-600 font-bold mb-3">About</h2>
                        <p className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                            {profile.about || 'No bio provided.'}
                        </p>
                    </section>

                    {/* Basic Details */}
                    <section>
                        <h2 className="text-rose-600 font-bold mb-3">Basic Details</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Religion</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.religion}</p>
                            </div>
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Caste</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.caste}</p>
                            </div>
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Gender</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.gender}</p>
                            </div>
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Marital Status</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.maritalStatus}</p>
                            </div>
                            <div className={`${fieldBox} col-span-2`}>
                                <p className={fieldLabel}>Date of Birth</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : ''}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Professional Details */}
                    <section>
                        <h2 className="text-rose-600 font-bold mb-3">Professional Details</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Occupation</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.occupation}</p>
                            </div>
                            <div className={fieldBox}>
                                <p className={fieldLabel}>Annual Income</p>
                                <p className="text-sm font-semibold text-gray-800">₹{profile.income}</p>
                            </div>
                            <div className={`${fieldBox} col-span-2`}>
                                <p className={fieldLabel}>Work Location / Address</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.address}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetails
