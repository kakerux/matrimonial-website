const Message = require('../Model/Messagemodel')
const Heart = require('../Model/Heart')
const UserProfile = require('../Model/UserProfile')

// only lets messaging happen between two users who mutually hearted each other
const isMatched = async (userA, userB) => {
    const [aToB, bToA] = await Promise.all([
        Heart.exists({ fromUserId: userA, toUserId: userB }),
        Heart.exists({ fromUserId: userB, toUserId: userA }),
    ])
    return Boolean(aToB && bToA)
}

const sendMessage = async (req, res) => {
    try {
        const fromUserId = req.user.UserId
        const { toUserId } = req.params
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' })
        }

        const matched = await isMatched(fromUserId, toUserId)
        if (!matched) {
            return res.status(403).json({ message: "You can only message users you've matched with" })
        }

        const message = await Message.create({ fromUserId, toUserId, text: text.trim() })

        const io = req.app.get('io')
        io.to(toUserId.toString()).emit('newMessage', message)

        res.status(201).json(message)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// full message history between the logged-in user and one specific other user
const getConversation = async (req, res) => {
    try {
        const userId = req.user.UserId
        const { otherUserId } = req.params

        const messages = await Message.find({
            $or: [
                { fromUserId: userId, toUserId: otherUserId },
                { fromUserId: otherUserId, toUserId: userId },
            ],
        }).sort({ createdAt: 1 })

        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// one row per matched person, with their profile + the most recent message (if any)
const getConversations = async (req, res) => {
    try {
        const userId = req.user.UserId

        const sentHearts = await Heart.find({ fromUserId: userId }).select('toUserId')
        const sentToIds = sentHearts.map((h) => h.toUserId.toString())

        const mutualHearts = await Heart.find({
            fromUserId: { $in: sentToIds },
            toUserId: userId,
        }).select('fromUserId')

        const matchedUserIds = mutualHearts.map((h) => h.fromUserId)

        const profiles = await UserProfile.find({ UserId: { $in: matchedUserIds } })

        const conversations = await Promise.all(
            profiles.map(async (profile) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: profile.UserId },
                        { fromUserId: profile.UserId, toUserId: userId },
                    ],
                }).sort({ createdAt: -1 })

                return {
                    userId: profile.UserId,
                    name: profile.name,
                    photoUrl: profile.profileImage ? `http://localhost:3000/uploads/${profile.profileImage}` : null,
                    lastMessage: lastMessage?.text || null,
                    lastMessageAt: lastMessage?.createdAt || null,
                }
            })
        )

        res.json(conversations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { sendMessage, getConversation, getConversations }