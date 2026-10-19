import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import CouplePhoto from '../assets/weddinglogin.jpg'

const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other']

const SignUp = () => {
    const navigate = useNavigate()

    const [frm, setFrm] = useState({ gender: '', religion: '' })
    const ninput = (e) => {
        setFrm({ ...frm, [e.target.name]: e.target.value })
    }

    const nsubmit = (e) => {
        e.preventDefault() // stops the page reload that was killing the request before axios could finish
        axios.post('http://localhost:3000/signup', frm)
            .then(() => {
                toast.success('Sign Up Successful')
                navigate('/login')
            })
            .catch((e) => {
                console.log('error occured', e)
                toast.error(e.response?.data?.message || 'Sign up failed')
            })
    }

    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden border-gray-900 flex flex-col md:flex-row">

                {/* Left: couple photo */}
                <div
                    className="relative w-full md:w-1/2 h-56 md:h-auto bg-cover bg-center bg-rose-100"
                    style={{ backgroundImage: `url(${CouplePhoto})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-200/70 to-amber-100/70 flex items-center justify-center md:hidden">
                        <span className="text-rose-500 text-sm font-medium">Add your photo</span>
                    </div>
                </div>

                {/* Right: form */}
                <div className="relative w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center overflow-hidden">
                    <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-40" />

                    <div className="relative">
                        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Sign Up</h1>
                        <p className="text-gray-500 text-center text-sm mt-1 mb-8">
                            Create your account to get started
                        </p>

                        <form onSubmit={nsubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm text-gray-700 mb-1.5">
                                    Enter Your Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    onChange={ninput}
                                    name="name"
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 mb-1.5">
                                    Enter Your Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    onChange={ninput}
                                    name="email"
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm text-gray-700 mb-1.5">
                                    Enter Your Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    onChange={ninput}
                                    name="password"
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors"
                                />
                            </div>

                            <div>
                                <p className="block text-sm text-gray-700 mb-2">I am a</p>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={frm.gender === 'Female'}
                                            onChange={ninput}
                                            required
                                            className="accent-rose-600"
                                        />
                                        Female
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={frm.gender === 'Male'}
                                            onChange={ninput}
                                            required
                                            className="accent-rose-600"
                                        />
                                        Male
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="religion" className="block text-sm text-gray-700 mb-1.5">
                                    Religion
                                </label>
                                <select
                                    id="religion"
                                    name="religion"
                                    value={frm.religion}
                                    onChange={ninput}
                                    required
                                    className="w-full border-2 border-rose-300 rounded-lg px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-colors bg-white"
                                >
                                    <option value="" disabled>Select your religion</option>
                                    {religionOptions.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors mt-2"
                            >
                                Sign Up
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-rose-600 font-semibold hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
