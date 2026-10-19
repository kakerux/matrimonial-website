const User = require('../Model/UserSignLogin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SignUp = async (req , res) => {
    const {name , email , password , gender , religion} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const data = await User.create({
        name , email , password:hashedPassword , gender , religion
    })
    console.log(data)
    res.json({message:'User registered successfully' , data})
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ UserId: user._id, Role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({
        message: 'Login successful',
        token,
        role: user.role,
        name: user.name,
        gender: user.gender,
        religion: user.religion,
    })
}

const UserProfile = async (req , res) => {
    res.json({message:'User profile'})
}

const AdminProfile = async (req , res) => {
    res.json({message:'Admin profile'})
}

module.exports = {SignUp , Login , UserProfile , AdminProfile}