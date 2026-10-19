const User = require('../Model/UserSignLogin') // adjust to your actual User model path
const UserProfile = require('../Model/UserProfile')

// ── Dashboard ──────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } })
        const activeProfiles = await UserProfile.countDocuments()
        const pendingVerification = await UserProfile.countDocuments({ verified: false })
        res.json({ totalUsers, activeProfiles, pendingVerification })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
const getUserGrowth = async (req, res) => {
    try {
        const growth = await User.aggregate([
            { $match: { role: { $ne: 'admin' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])
        res.json(growth.map((g) => ({ month: g._id, count: g.count })))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
// excludes admins, and attaches each user's profile photo + profile id
// (for the "View Profile" link) since a raw User document has neither
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password')
 
        const userIds = users.map((u) => u._id)
        const profiles = await UserProfile.find({ UserId: { $in: userIds } })
        const profileByUserId = {}
        profiles.forEach((p) => { profileByUserId[p.UserId.toString()] = p })
 
        const enriched = users.map((u) => {
            const p = profileByUserId[u._id.toString()]
            return {
                _id: u._id,
                name: u.name,
                email: u.email,
                profileId: p?._id || null,
                photoUrl: p?.profileImage ? `http://localhost:3000/uploads/${p.profileImage}` : null,
            }
        })
 
        res.json(enriched)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
const deleteUser = async (req, res) => {
    try {
        const target = await User.findById(req.params.id)
        if (target?.role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted from here' })
        }
        await User.findByIdAndDelete(req.params.id)
        await UserProfile.findOneAndDelete({ UserId: req.params.id })
        res.json({ message: 'User deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
const getPendingProfiles = async (req, res) => {
    try {
        const profiles = await UserProfile.find({ verified: false })
        res.json(profiles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
const verifyProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        )
        if (!profile) return res.status(404).json({ message: 'Profile not found' })
        res.json(profile)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
module.exports = {
    getStats,
    getUserGrowth,
    getAllUsers,
    deleteUser,
    getPendingProfiles,
    verifyProfile,
}
 