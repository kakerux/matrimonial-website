const Heart = require('../Model/Heart') // adjust path to wherever you save HeartModel.js
const UserProfile = require('../Model/UserProfile')

const createHeart = async (req, res) => {
    try {
        const fromUserId = req.user.UserId
        const { toUserId } = req.params
 
        if (req.user.Role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts cannot send hearts' })
        }
        if (fromUserId === toUserId) {
            return res.status(400).json({ message: "You can't send a heart to yourself" })
        }
 
        const heart = await Heart.findOneAndUpdate(
            { fromUserId, toUserId },
            { fromUserId, toUserId },
            { upsert: true, returnDocument:'after', setDefaultsOnInsert: true }
        )
 
        const mutual = await Heart.exists({
            fromUserId: toUserId,
            toUserId: fromUserId,
            status: { $ne: 'declined' },
        })
 
        const io = req.app.get('io')
        console.log('emitting newHeart to', toUserId) 
        io.to(toUserId.toString()).emit('newHeart')
 
        res.status(201).json({ heart, isMatch: Boolean(mutual) })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
 
const getHeartStatus = async (req, res) => {
    try {
        const fromUserId = req.user.UserId
        const { toUserId } = req.params
        const sent = await Heart.exists({ fromUserId, toUserId, status: { $ne: 'declined' } })
        res.json({ sent: Boolean(sent) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
// hearts sitting in the logged-in user's inbox, waiting on Accept/Decline
const getReceivedHearts = async (req, res) => {
    try {
        const userId = req.user.UserId
        const hearts = await Heart.find({ toUserId: userId, status: 'pending' }).sort({ createdAt: -1 })
 
        const senderIds = hearts.map((h) => h.fromUserId)
        const profiles = await UserProfile.find({ UserId: { $in: senderIds } })
        const profileByUserId = {}
        profiles.forEach((p) => { profileByUserId[p.UserId.toString()] = p })
 
        const requests = hearts.map((h) => {
            const p = profileByUserId[h.fromUserId.toString()]
            return {
                heartId: h._id,
                profileId: p?._id,
                name: p?.name || 'Unknown',
                age: p?.age,
                city: p?.city,
                photoUrl: p?.profileImage ? `http://localhost:3000/uploads/${p.profileImage}` : null,
            }
        })
 
        res.json(requests)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
// Accept = reciprocate the heart, which is what actually creates the match
const acceptHeart = async (req, res) => {
    try {
        const myId = req.user.UserId
        const { heartId } = req.params
 
        const originalHeart = await Heart.findById(heartId)
        if (!originalHeart || originalHeart.toUserId.toString() !== myId) {
            return res.status(404).json({ message: 'Heart request not found' })
        }
 
        originalHeart.status = 'accepted'
        await originalHeart.save()
 
        await Heart.findOneAndUpdate(
            { fromUserId: myId, toUserId: originalHeart.fromUserId },
            { fromUserId: myId, toUserId: originalHeart.fromUserId, status: 'accepted' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
 
        const io = req.app.get('io')
        io.to(originalHeart.fromUserId.toString()).emit('newMatch')
 
        res.json({ message: "It's a match!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
 
const declineHeart = async (req, res) => {
    try {
        const myId = req.user.UserId
        const { heartId } = req.params
 
        const heart = await Heart.findById(heartId)
        if (!heart || heart.toUserId.toString() !== myId) {
            return res.status(404).json({ message: 'Heart request not found' })
        }
 
        heart.status = 'declined'
        await heart.save()
 
        res.json({ message: 'Declined' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
 
const getMatches = async (req, res) => {
    try {
        const userId = req.user.UserId
 
        const sentHearts = await Heart.find({ fromUserId: userId, status: { $ne: 'declined' } }).select('toUserId')
        const sentToIds = sentHearts.map((h) => h.toUserId.toString())
 
        const mutualHearts = await Heart.find({
            fromUserId: { $in: sentToIds },
            toUserId: userId,
            status: { $ne: 'declined' },
        }).select('fromUserId')
 
        const matchedUserIds = mutualHearts.map((h) => h.fromUserId)
        const profiles = await UserProfile.find({ UserId: { $in: matchedUserIds } })
 
        const withPhotoUrl = profiles.map((p) => ({
            ...p.toObject(),
            photoUrl: p.profileImage ? `http://localhost:3000/uploads/${p.profileImage}` : null,
        }))
 
        res.json(withPhotoUrl)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
 
module.exports = {
    createHeart,
    getHeartStatus,
    getReceivedHearts,
    acceptHeart,
    declineHeart,
    getMatches,
}