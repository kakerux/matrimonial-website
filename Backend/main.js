const express = require('express');
const app = express();
const noCache = require('./Middleware/noCache') // adjust path to wherever you save it
app.use(noCache)
const Router = require('./Router/Profile');
const cors = require('cors');
const http = require('http')
const initSocket = require('./Sockets/socket')

// multer image
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors());
app.use(express.json());


require('./Config/db')
app.use(Router);



const server = http.createServer(app)
const io = initSocket(server)
app.set('io', io) // makes it reachable from any controller via req.app.get('io')

server.listen(3000, () => console.log('Server running on port 3000'))