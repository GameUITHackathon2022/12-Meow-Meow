const room = require('../../models/roomModel');
const { AppError } = require('../../common/errors/AppError');
const User = require('../../models/userModel');

module.exports = {
    getRoom(req, res) {
        var filter = {};
        filter.roomID = req.params.roomID;
        room.findOne(filter)
            .then((room) => {
                console.log(filter);
                res.send(room);
            })
            .catch(() => res.status(500).send({ message: 'Cannot get rooms' }));
    },

    getAllAvailableRooms(req, res) {
        room.find({ users: { $exists: true, $not: { $size: 0 } } })
            .then((room) => {
                res.status(200).send(room);
            })
            .catch(() => res.status(500).send({ message: 'Cannot get all rooms' }));
    },

    addRoom(req, res) {
        const {} = req.body;
        const newRoom = new room({
            userCreated: req.user.id,
            ...req.body,
        });
        newRoom
            .save()
            .then(() => {
                res.status(200).send({ message: 'created' });
            })
            .catch((err) => {
                console.log(err);
                res.status(503).send({ message: 'fail create room' });
            });
    },

    modifyRoom(req, res) {
        const roomObject = req.body;
        const roomId = req.params.roomId;
        room.findOneAndUpdate({ _id: roomId }, roomObject, { new: true })
            .then((room) => {
                res.send(room);
            })
            .catch(() => res.status(503).send({ message: 'Cannot modify room' }));
    },

    deleteRoom(req, res) {
        const roomID = req.params.roomID;
        room.findOneAndDelete({ roomID: roomID })
            .then(() => res.send({ message: `delete ${roomID}` }))
            .catch((err) => {
                console.log(err);
                res.status(503).send({ message: 'Cannot delete room' });
            });
    },

    joinRoom: async (req, res, next) => {
        try {
            const roomID = req.params.roomID;
            const socketID = req.params.socketID;
            let room1 = await room.findById(roomID);
            const token = req.cookies.token;
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decodeToken.userId);
            if (!token && !user) {
                room1.users.push({ socketID: socketID });
            } else {
                if (decodeToken.userId.toString() === room1.userCreated.toString()) room1.socketID = socketID;
                else room1.users.push({ socketID: socketID, userID: decodeToken.userId });
            }
            await room1.save();
            res.status(200).send({
                statusCode: 200,
                statusRoom: room1.isClosed,
            });
        } catch (error) {
            next(new AppError(error.statusCode, error.message));
        }
    },

    outRoom: async (req, res) => {
        try {
            const roomID = req.params.roomID;
            const socketID = req.params.socketID;
            let room1 = await room.findById(roomID);
            if (socketID === room1.socketID) room1.isClosed = true;
            else {
                let userFilter = room1.users.filter((user) => {
                    return user.socketID !== socketID;
                });
                room1.users = userFilter;
            }
            await room1.save();
            res.status(200).send({
                statusCode: 200,
                message: 'Out room successfully',
            });
        } catch (error) {
            next(new AppError(error.statusCode, error.message));
        }
    },
};
