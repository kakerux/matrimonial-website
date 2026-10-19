import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import CoupleHands from '../assets/couplehands.avif'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [frm, setFrm] = useState({})

    const iinput = (e) => {
        setFrm({ ...frm, [e.target.name]: e.target.value })
    }

    const isubmit = (e) => {
        e.preventDefault()
        console.log(frm)
        axios.post('http://localhost:3000/login', frm)
            .then((res) => {
                console.log(res.data)
                if (res.data.token) {
                    // gender/religion now come from the stored account
                    // (set once at Sign Up) instead of being re-entered here
                    login({
                        token: res.data.token,
                        role: res.data.role,
                        name: res.data.name,
                        gender: res.data.gender,
                        religion: res.data.religion,
                    })

                    if (res.data.role === 'admin') {
                        toast.success('Admin Login Successful')
                        navigate('/admin')
                    } else {
                        toast.success('Login Successful')
                        navigate('/')
                    }
                }
            })
            .catch((e) => {
                console.log('error occured', e.response?.data)
                toast.error(e.response?.data?.message || 'Login failed')
            })
    }

    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row">

                <div
                    className="relative w-full md:w-1/2 h-56 md:h-auto bg-cover bg-center bg-rose-100"
                    style={{ backgroundImage: `url(${CoupleHands})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-200/70 to-amber-100/70 flex items-center justify-center md:hidden">
                        <span className="text-rose-500 text-sm font-medium">Add your photo</span>
                    </div>
                </div>

                <div className="relative w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center overflow-hidden">
                    <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-40" />

                    <div className="relative">
                        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Login</h1>

                        <form onSubmit={isubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 mb-1.5">
                                    Enter Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={iinput}
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm text-gray-700 mb-1.5">
                                    Enter Your Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={iinput}
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors mt-2"
                            >
                                Login
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                <Link to="/forgot-password" className="hover:underline">
                                    Forget your Password?
                                </Link>
                            </p>

                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-rose-600 font-semibold hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
