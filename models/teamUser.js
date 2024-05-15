/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const teamUserSchema = new Schema({
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: false,
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    priority: {
        type: Number,
        required: true,
        default: 0
    },
    isDeleted: {
        type: String,
        enum: ["n", "y"],
        default: "n"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // immutable:true //This field value can not be modifed once added
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("TeamUser", teamUserSchema);