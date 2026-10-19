import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios
            .get('http://localhost:3000/admin/settings', { headers })
            .then((res) => setSettings(res.data))
            .catch((error) => {
                console.log('error occured', error.response?.data)
                toast.error('Unable to load settings')
            })
            .finally(() => setLoading(false))
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setSettings((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await axios.put('http://localhost:3000/admin/settings', settings, { headers })
            setSettings(res.data)
            toast.success('Settings saved')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to save settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="text-gray-400">Loading settings...</p>
    if (!settings) return <p className="text-gray-400">Unable to load settings.</p>

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>

            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
                    <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                    <input
                        type="email"
                        name="supportEmail"
                        value={settings.supportEmail}
                        onChange={handleChange}
                        placeholder="support@yoursite.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Phone</label>
                    <input
                        type="text"
                        name="supportPhone"
                        value={settings.supportPhone}
                        onChange={handleChange}
                        placeholder="1800-123-4567"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text</label>
                    <textarea
                        name="aboutText"
                        value={settings.aboutText}
                        onChange={handleChange}
                        rows={3}
                        placeholder="A short description of your platform, shown in the footer or About page."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors resize-none"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                        className="w-4 h-4"
                    />
                    Maintenance mode
                </label>
                <p className="text-xs text-gray-400 -mt-3">
                    Note: Maintenance Mode is currently under working 
                    {/* Note: turning this on doesn't do anything on its own yet — it saves the flag, but no page currently
                    checks it to actually show a maintenance screen. Let me know if you want that wired up too. */}
                </p>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    )
}

export default AdminSettings
