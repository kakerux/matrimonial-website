const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization // expected format: "Bearer <token>"

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        // matches the literal secret used in Login's jwt.sign(...) call
        const decoded = jwt.verify(token, 'secretkey')
        req.user = decoded // shape: { UserId, Role } — capitalized, matching Login's payload
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports = authMiddleware