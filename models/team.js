/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const teamSchema = new Schema({
    teamName: {
        type: String,
        required: true
    },
    doNotDisturbStatus: {
        type: Boolean,
        default: false
    },
    callRoutingType: {
        type: String,
        enum: ["round_robin", "simultaneous"],
        default: "round_robin"
    },
    callRecording: {
        type: Boolean,
        default: false
    },
    addAllUsers: {
        type: Boolean,
        required: false,
        default: false
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        default: null
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
module.exports = mongoose.model("Team", teamSchema);