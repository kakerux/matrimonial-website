const mongoose = require('mongoose')

const SiteSettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'Shaadi.com',
    },
    supportEmail: {
        type: String,
        default: '',
    },
    supportPhone: {
        type: String,
        default: '',
    },
    aboutText: {
        type: String,
        default: '',
    },
    maintenanceMode: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema)
module.exports = SiteSettings