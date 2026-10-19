const UserProfile = require('../Model/UserProfile');

const createProfile = async (req, res) => {
    try {
        const data = await UserProfile.create({
            ...req.body,
            UserId: req.user.UserId, // matches Login's jwt.sign payload key
            profileImage: req.file ? req.file.filename : undefined,
        })
        res.status(201).json(data)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const ProfileLatest = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 3
        const { gender, religion } = req.query
 
        const filter = {}
        if (gender) filter.gender = new RegExp(`^${gender}$`, 'i')
        if (religion && religion.toLowerCase() !== 'other') {
            filter.religion = new RegExp(`^${religion}$`, 'i')
        }
 
        const profiles = await UserProfile.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
 
        const withPhotoUrl = profiles.map((p) => ({
            ...p.toObject(),
            photoUrl: p.profileImage ? `http://localhost:3000/uploads/${p.profileImage}` : null,
        }))
 
        res.json(withPhotoUrl)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch profiles' })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ UserId: req.user.UserId })
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        res.json(profile)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body }
 
        delete updateData._id
        delete updateData.id
        delete updateData.__v
        delete updateData.UserId
        delete updateData.createdAt
        delete updateData.updatedAt
 
        if (req.file) {
            updateData.profileImage = req.file.filename
        }
 
        const profile = await UserProfile.findOneAndUpdate(
            { UserId: req.user.UserId },
            updateData,
            { new: true, runValidators: true }
        )
 
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
 
        res.json(profile)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
const getProfileById = async (req, res) => {
    try {
        const profile = await UserProfile.findById(req.params.id)
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        res.json(profile)
    } catch (error) {
        // an invalid/malformed ObjectId throws a CastError here, not a real 500
        res.status(400).json({ message: 'Invalid profile id' })
    }
}

const searchProfiles = async (req, res) => {
    try {
        const { age, religion, caste, city, state, occupation, location , gender} = req.query
        const filter = {}

        // exact-ish matches (case-insensitive) — good for values coming from
        // the Browse Profiles By menu, which sends known fixed option strings
        if (gender) filter.gender = new RegExp(`^${gender}$`, 'i')
        if (religion) filter.religion = new RegExp(`^${religion}$`, 'i')
        if (caste) filter.caste = new RegExp(`^${caste}$`, 'i')
        if (state) filter.state = new RegExp(`^${state}$`, 'i')

        // occupation and city/location are more likely to be free-typed from
        // the homepage search box, so these use partial matching instead
        if (occupation) filter.occupation = new RegExp(occupation, 'i')
        const cityValue = city || location // Home.jsx's hero search calls this field "location"
        if (cityValue) filter.city = new RegExp(cityValue, 'i')

        // age can arrive as a single number ("28") or a range ("25-30")
        if (age) {
            if (age.includes('-')) {
                const [min, max] = age.split('-').map(Number)
                filter.age = {}
                if (!Number.isNaN(min)) filter.age.$gte = min
                if (!Number.isNaN(max)) filter.age.$lte = max
            } else {
                const exact = Number(age)
                if (!Number.isNaN(exact)) filter.age = exact
            }
        }

        const profiles = await UserProfile.find(filter)

        // same mapping used in ProfileLatest/getMatches, so ProfileCard shows
        // the real photo here too instead of its placeholder box
        const withPhotoUrl = profiles.map((p) => ({
            ...p.toObject(),
            photoUrl: p.profileImage ? `http://localhost:3000/uploads/${p.profileImage}` : null,
        }))

        res.json(withPhotoUrl)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




    
module.exports = { createProfile, ProfileLatest , getMyProfile , updateProfile , getProfileById ,searchProfiles}  
