import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Each key here must match a real field name on UserProfileSchema, since it's
// sent straight to /search-results?<key>=<value> which your backend filters by.
const CATEGORIES = [
    {
        key: 'religion',
        label: 'Religion',
        options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish'],
    },
    {
        key: 'caste',
        label: 'Caste',
        options: ['Brahmin', 'Kshatriya', 'Vaishya', 'Yadav', 'Rajput', 'Kayastha', 'Reddy', 'Nair', 'Maratha', 'Jat'],
    },
    {
        key: 'city',
        label: 'City',
        options: ['Mumbai', 'Bhopal' , 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Indore', 'Jaipur'],
    },
    {
        key: 'occupation',
        label: 'Occupation',
        options: ['Software Engineer', 'Doctor', 'Teacher', 'Government Employee', 'Business Owner', 'Chartered Accountant', 'Lawyer', 'Banker', 'Civil Engineer', 'Professor'],
    },
    {
        key: 'state',
        label: 'State',
        options: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
    },
]

const BrowseProfilesMenu = () => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key)
    const containerRef = useRef(null)
    const { user } = useAuth()

    // close the menu on any click outside it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (categoryKey, value) => {
    setIsOpen(false)
    const params = new URLSearchParams({ [categoryKey]: value })

    if (user?.gender) {
        const oppositeGender = user.gender === 'Male' ? 'Female' : user.gender === 'Female' ? 'Male' : ''
        if (oppositeGender) params.set('gender', oppositeGender)
    }

    navigate(`/search-results?${params.toString()}`)
}

    const active = CATEGORIES.find((c) => c.key === activeCategory)

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
            >
                Browse Profiles By
                <ChevronDown className={`w-4 h-4 cursor-pointer transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute cursor-pointer left-0 top-full mt-3 flex bg-white border border-pink-100 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* left: category list */}
                    <div className="w-56 cursor-pointer border-r border-pink-100 py-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.key}
                                type="button"
                                onMouseEnter={() => setActiveCategory(category.key)}
                                onClick={() => setActiveCategory(category.key)}
                                className={`w-full cursor-pointer flex items-center justify-between px-5 py-3 text-sm text-left transition-colors ${
                                    activeCategory === category.key
                                        ? 'bg-pink-50 text-pink-600 font-semibold'
                                        : 'text-gray-700 hover:bg-pink-50/60'
                                }`}
                            >
                                {category.label}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ))}
                    </div>

                    {/* right: options grid for the active category */}
                    <div className="w-[480px] cursor-pointer p-6 grid grid-cols-3 gap-x-6 gap-y-4">
                        {active.options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelect(active.key, option)}
                                className="text-left cursor-pointer text-sm text-gray-700 hover:text-pink-600 transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrowseProfilesMenu
