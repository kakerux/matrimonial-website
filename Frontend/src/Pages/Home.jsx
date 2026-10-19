import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
// import HowItWorks from '../Components/HowItWorks'
// import SuccessStories from '../Components/SuccessStories'
import ProfileCard from '../Components/ProfileCard'
import WeddingImage from '../assets/weddingimage.jpg'


// Counts up from 0 to `target` once it scrolls into view, instead of just
// appearing — small detail that makes numbers feel alive rather than static.
const AnimatedCounter = ({ target, suffix = '', duration = 1.4 }) => {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    const startCount = () => {
        if (hasAnimated) return
        setHasAnimated(true)
        const startTime = performance.now()
        const step = (now) => {
            const progress = Math.min((now - startTime) / (duration * 1000), 1)
            // ease-out so it settles smoothly instead of stopping abruptly
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }

    return (
        <motion.p
            onViewportEnter={startCount}
            viewport={{ once: true, margin: '-50px' }}
            className="text-3xl font-extrabold"
        >
            {count.toLocaleString()}
            {suffix}
        </motion.p>
    )
}

const Home = () => {
    const navigate = useNavigate()

    // cycles the last word of the hero headline every couple seconds
    const rotatingWords = ['Match', 'Spouse', 'Partner', 'Soulmate']
    const [wordIndex, setWordIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const [criteria, setCriteria] = useState({ age: '', religion: '', location: '' })
    const [featured, setFeatured] = useState([])
    const [loadingFeatured, setLoadingFeatured] = useState(true)

    const handleCriteriaChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value })
    }

    const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(
        Object.entries(criteria).filter(([, value]) => value.trim() !== '')
    )

    

    // always restrict to opposite gender, same as the homepage's default feed
    if (user?.gender) {
        const oppositeGender = user.gender === 'Male' ? 'Female' : user.gender === 'Female' ? 'Male' : ''
        if (oppositeGender) params.set('gender', oppositeGender)
    }

    navigate(`/search-results?${params.toString()}`)
}

const handleBrowseClick = () => {
    const params = new URLSearchParams()
    if (user?.gender) {
        const oppositeGender = user.gender === 'Male' ? 'Female' : user.gender === 'Female' ? 'Male' : ''
        if (oppositeGender) params.set('gender', oppositeGender)
    }
    navigate(`/search-results?${params.toString()}`)
}

    const { user } = useAuth()

    useEffect(() => {
        const params = new URLSearchParams({ limit: '3' })

        // logged-in users see opposite-gender, same-religion profiles by
        // default here — Browse Profiles is the deliberate way to look at
        // other religions/genders, so this feed intentionally stays narrow
        if (user?.gender && user?.religion) {
            const oppositeGender = user.gender === 'Male' ? 'Female' : user.gender === 'Female' ? 'Male' : ''
            if (oppositeGender) params.set('gender', oppositeGender)
            params.set('religion', user.religion)
        }

        axios.get(`http://localhost:3000/profiles/latest?${params.toString()}`)
            .then((res) => setFeatured(res.data))
            .catch((e) => console.log('error occured', e))
            .finally(() => setLoadingFeatured(false))
    }, [user])

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero + search */}
            <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-white pt-20 pb-16 px-6">
                {/* soft ambient shapes — slow, barely-there drift, not the previous bouncing blobs */}
                <motion.div
                    className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100/70 rounded-full blur-3xl pointer-events-none"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-pink-100/60 rounded-full blur-3xl pointer-events-none"
                    animate={{ y: [0, -18, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                />

                <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-xs font-bold tracking-[0.2em] text-rose-500 uppercase mb-4"
                        >
                            Trusted by 10,000+ families
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                            className="font-serif text-4xl sm:text-5xl leading-[1.15] text-gray-900 flex flex-wrap items-baseline justify-center md:justify-start gap-x-3"
                        >
                            <span>Find Your Perfect</span>
                            <span className="relative inline-block h-[1.15em] min-w-[210px] overflow-hidden text-left align-bottom text-rose-600 italic">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={rotatingWords[wordIndex]}
                                        initial={{ y: 28, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -28, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute left-0 top-0"
                                    >
                                        {rotatingWords[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                            className="text-gray-500 text-lg mt-6 max-w-md mx-auto md:mx-0"
                        >
                            A trusted space to meet compatible partners — guided by real connection, not just algorithms.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                            className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start"
                        >
                            {!user && (
                            <motion.a
                                href="/signup"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-rose-200 transition-colors"
                            >
                                Get Started
                            </motion.a>
                            )}  
                           <button
                                 type="button"
                                onClick={handleBrowseClick}
                                className="border-2 border-rose-200 text-rose-600 px-7 py-3 rounded-full font-semibold hover:bg-rose-50 transition-colors"
                                >
                                  Browse Profiles
                                </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
                            {/* Swap this for a real couple photo — same idea as the Login/SignUp pages */}
                            <span className="text-rose-300 text-sm font-medium"><img src={WeddingImage} alt="" /></span>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg px-5 py-3 border border-rose-100"
                        >
                            <p className="text-sm font-bold text-gray-900">5,000+ Success Stories</p>
                            <p className="text-xs text-gray-400">and counting</p>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                    className="relative max-w-4xl mx-auto mt-16 bg-white rounded-2xl shadow-xl shadow-rose-100/60 border border-rose-100 p-6 sm:p-8"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border border-rose-100 rounded-lg px-4 py-3 text-left transition-colors focus-within:border-rose-300">
                            <label htmlFor="age" className="block text-xs font-semibold text-rose-500 mb-1">
                                Age
                            </label>
                            <input
                                id="age"
                                type="text"
                                name="age"
                                value={criteria.age}
                                onChange={handleCriteriaChange}
                                placeholder="e.g. 25-30"
                                className="w-full bg-transparent outline-none border-b border-gray-200 focus:border-rose-300 pb-1.5 text-base"
                            />
                        </div>
                        <div className="border border-rose-100 rounded-lg px-4 py-3 text-left transition-colors focus-within:border-rose-300">
                            <label htmlFor="religion" className="block text-xs font-semibold text-rose-500 mb-1">
                                Religion
                            </label>
                            <input
                                id="religion"
                                type="text"
                                name="religion"
                                value={criteria.religion}
                                onChange={handleCriteriaChange}
                                placeholder="e.g. Hindu"
                                className="w-full bg-transparent outline-none border-b border-gray-200 focus:border-rose-300 pb-1.5 text-base"
                            />
                        </div>
                        <div className="border border-rose-100 rounded-lg px-4 py-3 text-left transition-colors focus-within:border-rose-300">
                            <label htmlFor="location" className="block text-xs font-semibold text-rose-500 mb-1">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={criteria.location}
                                onChange={handleCriteriaChange}
                                placeholder="e.g. Mumbai"
                                className="w-full bg-transparent outline-none border-b border-gray-200 focus:border-rose-300 pb-1.5 text-base"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Search Profiles
                    </motion.button>
                </motion.form>
            </section>

            {/* Stats */}
            <section className="max-w-5xl mx-auto mt-16 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
                {[
                    { target: 10000, suffix: '+', label: 'Active Profiles', bg: 'bg-pink-50 border-pink-100', color: 'text-pink-600' },
                    { target: 5000, suffix: '+', label: 'Success Stories', bg: 'bg-pink-100 border-pink-200', color: 'text-pink-700' },
                    { target: 50, suffix: '+', label: 'Countries', bg: 'bg-pink-50 border-pink-100', color: 'text-pink-600' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                        whileHover={{ y: -4 }}
                        className={`${stat.bg} border rounded-xl p-6 text-center transition-shadow hover:shadow-md`}
                    >
                        <div className={stat.color}>
                            <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* <HowItWorks /> */}

            {/* Featured profiles */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-pink-600 text-center mb-10"
                >
                    Featured Profiles
                </motion.h2>

                {loadingFeatured ? (
                    <p className="text-center text-gray-400">Loading profiles...</p>
                ) : featured.length === 0 ? (
                    <p className="text-center text-gray-400">No profiles to show yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {featured.map((profile, i) => (
                            <motion.div
                                key={profile._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                                whileHover={{ y: -6 }}
                            >
                                <ProfileCard profile={profile} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* <SuccessStories /> */}

            <Footer />
        </div>
    )
}

export default Home
