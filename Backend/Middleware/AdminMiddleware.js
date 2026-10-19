const adminMiddleware = (req, res, next) => {
    if (req.user?.Role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
    }
    next()
}

module.exports = adminMiddleware