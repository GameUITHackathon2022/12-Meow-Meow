#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
const room = require('../src/models/roomModel');
const { Server } = require('socket.io');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.clientI, process.env.clientII],
    },
});

io.of('/live').on('connection', (socket) => {
    socket.emit('myID', socket.id);
});

// io.engine.generateId = function (req) {
//   console.log(referer);
//   return Math.random() * 100000;
// }

io.of('/room').on('connection', async (socket) => {
    socket.emit('me', socket.id);
    socket.on('create room', (id) => {
        socket.join(id);
        socket.roomID = id;
        io.of('/live').emit('update room');
    });

    socket.on('join room', (id) => {
        socket.join(id);
        socket.roomID = id;
        socket.broadcast.to(id).emit('remote join room', socket.id);
        socket.broadcast.to(id).emit('new chat break', socket.id + ' joined room');
        io.of('/live').emit('update room');
    });

    io.of('/room').adapter.on('create-room', (room) => {
        console.log(`room ${room} was created`);
    });

    socket.on('turn webcam off', (roomID) => {
        socket.broadcast.to(roomID).emit('remote turned webcam off');
    });

    socket.on('turn webcam on', (roomID) => {
        socket.broadcast.to(roomID).emit('remote turned webcam on');
    });

    socket.on('start sharing screen', (roomID) => {
        socket.broadcast.to(roomID).emit('remote started sharing screen');
    });

    socket.on('stop sharing screen', (roomID) => {
        socket.broadcast.to(roomID).emit('remote stoped sharing screen');
    });

    socket.on('start sharing audio', (roomID) => {
        socket.broadcast.to(roomID).emit('remote started sharing audio');
    });

    socket.on('stop sharing audio', (roomID) => {
        socket.broadcast.to(roomID).emit('remote stoped sharing audio');
    });

    socket.on('me chat', ({ socketID, isOwner, content, roomID }) => {
        socket.broadcast.to(roomID).emit('remote chatted', { socketID, isOwner, content });
    });

    socket.on('me send code', ({ content, roomID }) => {
        socket.broadcast.to(roomID).emit('remote sent code', content);
    });

    socket.on('new chat break', ({ content, roomID }) => {
        socket.broadcast.to(roomID).emit('new chat break', content);
    });

    //Khi 1 ng?????i ng???t k???t n???i v???i room s??? x??a socket id c???a ng?????i ???? l??u trong DB ra
    //N???u ng?????i ???? l?? ch??? room th?? s??? x??a ph??ng v?? th??ng b??o cu???c g???i k???t th??c
    //N???u ng?????i ???? l?? ng?????i join v??o th?? s??? x??a socket.id c???a ng?????i ???? ??i v?? gi???m userCount xu???ng 1 ????n v??? ?????ng th???i th??ng b??o ch??? room bi???t c?? ng?????i r???i ??i
    socket.on('disconnect', () => {
        //T??m room m?? ng?????i v???a disconnect ???? ???
        // room.findOneAndDelete({userCount : 0}); //kh???i ?????i
        room.findOne({
            $or: [{ userCreated: socket.id }, { 'users.socketID': socket.id }],
        })
            .then((_room) => {
                //N???u room n??y ???? x??a ??? request kh??c r???i
                if (!_room && !_room.isClosed) {
                    return;
                }

                //N???u c??n m???t ng?????i ho???c l?? ch??? room l?? ng?????i tho??t th?? delete //L??c n??o c??ng l?? ch??? room v?? ch??? room m?? tho??t th?? ph??ng c??ng ph???i k???t th???c. logic <= 1 l?? l??u l??u b??? l???i n?? x??a lu??n
                if (_room.userCreated === socket.id) {
                    room.findOneAndUpdate({ roomID: _room.roomID }, { $set: { isClosed: true } }).then(() => {
                        socket.broadcast.to(_room.roomID).emit('end call');
                        io.of('/live').emit('update room');
                    });
                } else {
                    room.findOneAndUpdate(
                        {
                            roomID: _room.roomID,
                        },
                        { $pull: { users: { socketID: socket.id } } },
                        { safe: true, multi: false },
                    )
                        .then(() => {
                            console.log(socket.id + ' leave room');
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            //th??ng b??o ch??? room bi???t c?? ng?????i v???a tho??t
                            io.of('/live').emit('update room');
                            socket.broadcast.to(_room.roomID).emit('remote leave call');
                            socket.broadcast.to(_room.roomID).emit('new chat break', userID2 + ' left room');
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'url ' + 'http://localhost:' + addr.port; //dev
    console.log('Listening on ' + bind);
}
