const mongoose = require('mongoose');

const UserSignLoginSchema = new mongoose.Schema({
    name:{
        type:String , 
        reqired : true
    } ,  
    email:{
        type:String,
        required: true , 
        unique:true , 
        lowercase:true , 
        trim:true
    }, 
    password: {
        type:String , 
        required:true
    }, 
    gender: {
    type: String,
    required: true
},
religion: {
    type: String,
    required: true
},
    role:{
        type:String , 
        default:'user'
    }
},{ timestamps: true });

const User = mongoose.model('User', UserSignLoginSchema);
module.exports = User;