import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Components/Navbar'
import ProfileCard from '../Components/ProfileCard'

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:3000/profiles/search?${searchParams.toString()}`)
            .then((res) => setProfiles(res.data))
            .catch((e) => console.log('error occured', e))
            .finally(() => setLoading(false))
    }, [searchParams])

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Search Results</h1>
                <p className="text-sm text-gray-500 mb-8">
                    {[...searchParams.entries()].map(([key, value]) => `${key}: ${value}`).join(' · ') || 'All profiles'}
                </p>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : profiles.length === 0 ? (
                    <p className="text-gray-400">No profiles matched your search.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile) => (
                            <ProfileCard key={profile._id} profile={profile} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults
