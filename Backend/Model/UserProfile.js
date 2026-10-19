const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    name: {
        type: String,
        required: true
    } , 
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    } , 
    dateOfBirth: {
        type: Date,
        required: true
    }, 
    religion: { 
        type: String,
        required: true
    }, 
    caste: {
        type: String,
        required: true
    }, 
    education: {
        type: String,
        required: true
    } , 
    occupation: {
        type: String,
        required: true
    } , 
    income: {
        type: Number,
        required: true
} , 
    maritalStatus: {
        type: String,
        required: true
} , 
    address: {
        type: String,
        required: true
} , 
    city: {
        type: String,
        required: true
    } , 
    state: {
        type: String,
        required: true
    } , 
    height: {
        type: Number,
        required: true
    } , 
    about : {
        type: String,
        required: true  
    } , 
    profileImage : {
        type: String,
        required: true
    },
    
    verified: {
    type: Boolean,
    default: false
}
    
} , {timestamps: true});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;