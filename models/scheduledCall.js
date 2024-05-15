/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const scheduledCallSchema = new Schema({
    scheduledCallDateTime: {
        type: Date,
        required:true
    },
    noteToCall: {
        type: String,
        required: true
    },
    scheduledFor: {
        type: String,
        enum: ['team', 'user'],
        default: "team"
    },
    leadId: {
        type: Schema.Types.ObjectId,
        ref: "Lead",
        default: null,
        index: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        default: null,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        default: null
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        index: true,
    },
    isDeleted: {
        type: String,
        enum: ["n", "y"],
        default: "n"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // immutable:true //This field value can not be modified once added
    }
});
module.exports = mongoose.model("ScheduledCall", scheduledCallSchema);
