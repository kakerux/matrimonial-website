const SiteSettings = require('../Model/SiteSettingsmodel')

// there's only ever one settings document — create it with defaults the
// first time anyone asks for it, so the frontend never has to handle "no
// settings exist yet" as a separate case
const getSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne()
        if (!settings) {
            settings = await SiteSettings.create({})
        }
        res.json(settings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateSettings = async (req, res) => {
    try {
        const { siteName, supportEmail, supportPhone, aboutText, maintenanceMode } = req.body

        let settings = await SiteSettings.findOne()
        if (!settings) {
            settings = await SiteSettings.create({})
        }

        settings.siteName = siteName ?? settings.siteName
        settings.supportEmail = supportEmail ?? settings.supportEmail
        settings.supportPhone = supportPhone ?? settings.supportPhone
        settings.aboutText = aboutText ?? settings.aboutText
        settings.maintenanceMode = typeof maintenanceMode === 'boolean' ? maintenanceMode : settings.maintenanceMode

        await settings.save()
        res.json(settings)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = { getSettings, updateSettings }