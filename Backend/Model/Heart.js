const mongoose = require('mongoose')

const HeartSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
     status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    }
}, { timestamps: true })

// stops the same person sending a heart to the same target twice
HeartSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true })

const Heart = mongoose.model('Heart', HeartSchema)
module.exports = Heart