const mongoose = require("mongoose");
const { Schema } = mongoose;
const userDaysOffSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    holidayId: {
        type: Schema.Types.ObjectId,
        ref: "Holiday",
        required: true,
        index: true
    },
    doNotDisturb: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: String,
        enum: ["n", "y"],
        default: "n"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // immutable:true //This field value can not be modified once added
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("UserDaysOff", userDaysOffSchema);