const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
    description: {
        type: String,
        required: true,
    },
    dateStarted: {
        type: Date,
        default: Date.now,
    },
    dateEnded: {
        type: Date,
        required:true
    },
    users: {
		type: [
			{
					type: Schema.Types.ObjectId,
					required: true
			},
		]
    }
})

module.exports = mongoose.model("Campaign", campaignSchema);
