const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const room = new Schema(
    {
        userCreated: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        socketID: {
            type: String,
        },
        roomID: { type: String, require: true, unique: true },
        title: { type: String, maxlength: 100 },
        users: [
            {
                _id: false,
                userID: {
                    type: Schema.Types.ObjectId,
                },
                socketID: {
                    type: String,
                    required: true,
                },
            },
        ],
        maxUser: { type: Number, max: 20 },
        isClosed: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('room', room);
