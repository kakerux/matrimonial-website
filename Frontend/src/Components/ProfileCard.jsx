import { Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'

// profile shape expected: { _id, name, age, height, education, city, state, photoUrl, verified }
const ProfileCard = ({ profile }) => (
    <div className="border border-pink-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
        <div className="w-full aspect-[3/4] bg-pink-100">
    {profile.photoUrl && (
        <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
    )}
</div>
        <div className="p-4">
            <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-gray-900">{profile.name}</h3>
                {profile.verified && (
                    <span title="Verified profile">
                        <BadgeCheck className="w-4 h-4 text-pink-600 fill-pink-100" />
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
                {profile.age} yrs, {profile.height}
            </p>
            <p className="text-sm text-gray-500">{profile.education}</p>
            <p className="text-sm text-gray-500">📍 {profile.city}, {profile.state}</p>

            <Link
                to={`/profile/${profile._id}`}
                className="mt-4 block text-center border-2 border-pink-300 text-pink-600 font-semibold py-2 rounded-lg hover:bg-pink-50 transition-colors"
            >
                View Profile
            </Link>
        </div>
    </div>
)

export default ProfileCard
