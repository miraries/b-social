require('dotenv').config();
const server = require('http').createServer();
const io = require('socket.io')(server);
const passportJwtSocketIo = require('passport-jwt.socketio');
const {ExtractJwt} = require('passport-jwt');
const {setupConsumer, start} = require('./kafka');
const {inspect} = require('util')


const options = {
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    secretOrKey: process.env.JWT_SECRET
}

const verify = function (jwtPayload, done) {
    done(null, {id: jwtPayload.sub})
}

const findSocketByUserId = function (nsp, id) {
    return Object.values(nsp.connected).filter((socket) =>
        socket.handshake && // can i has optional chaining :/
        socket.handshake.user &&
        socket.handshake.user.id === id
    )
}

const getUserId = client => client.handshake.user ? client.handshake.user.id : null

const handleKafkaMessage = function (message) {
    const comment = JSON.parse(message.value.toString())

    const [socket] = findSocketByUserId(io.nsps['/'], 6)

    console.log(socket)

    if (!socket) {
        console.log('Got notification, user not connected, skipping')
        return
    }

    console.log('Got notification, user connected, sending', comment)
    socket.emit('comment_notification', comment);
}

io.use(passportJwtSocketIo.authorize(options, verify))
io.on('connection', client => {
    client.on('disconnect', () => {
        console.log('disconnected', {userId: getUserId(client)})
    });
    console.log('connected', {userId: getUserId(client)})
});

(async () => {
    const port = process.env.PORT

    server.listen(port || 8002);
    await start()
    await setupConsumer(handleKafkaMessage)
    // setInterval(() => console.log('all', findSocketByUserId(io.nsps['/'], null)), 5000)
    // setInterval(() => console.log('userid', findSocketByUserId(io.nsps['/'], 6)), 5000)
    console.log(`Web socket service running, listening on port ${port}`)
})()

