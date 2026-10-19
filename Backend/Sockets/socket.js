const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

// Call this once from your main server file, passing the http.Server instance
// (not the Express app) — see the wiring notes for exactly where.
const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: '*' }, // tighten this to your real frontend URL before deploying
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) return next(new Error('No token provided'))
        try {
            const decoded = jwt.verify(token, 'secretkey') // same literal secret as Login/authMiddleware
            socket.userId = decoded.UserId
            next()
        } catch (error) {
            next(new Error('Invalid or expired token'))
        }
    })

    io.on('connection', (socket) => {
        // every user gets a private room keyed by their own id — this is
        // what lets us do io.to(userId).emit(...) from anywhere in the app
        socket.join(socket.userId.toString())
    })

    return io
}

module.exports = initSocket