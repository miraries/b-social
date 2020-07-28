var socket = require('socket.io-client')('http://localhost:8002');
socket.on('connect', function () {
    console.log('connected')
});
socket.on('information', function (val) {
    console.log('information', val)
});
socket.on('pipe', function (val) {
    console.log('pipe', val)
});
socket.on('error', function (val) {
    console.log('error', val)
});
socket.on('event', function (data) {
    console.log({data})
});
socket.on('disconnect', function () {
    console.log('disconnected')
});
socket.on('comment_notification', function () {
    console.log('COMMENT NOTIFICATION WOLOLOLO')
});
socket.on('data', function () {
    console.log('COMMENT NOTIFICATION WOLOLOLO')
});
socket.on('connection', function (client) {
    console.log('connection');
    client.on('comment_notification', function (event) {    // <-- `socket.on()` instead of `io.on()`
        console.log('received client emit');
    });
});
socket.open()