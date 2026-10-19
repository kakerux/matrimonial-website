import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../Components/Navbar'
import ProfileCard from '../Components/ProfileCard'

const Matches = () => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        axios
            .get('http://localhost:3000/matches', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMatches(res.data))
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Matches</h1>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : matches.length === 0 ? (
                    <p className="text-gray-400">No matches yet — send some hearts and check back!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((profile) => (
                            <ProfileCard key={profile._id} profile={profile} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Matches
