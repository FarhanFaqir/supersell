/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const leadMeeting = new Schema({
    leadId: {
        type: Schema.Types.ObjectId,
        ref:"Lead",
        required:true
    },
    meetingId: {
        type: Schema.Types.ObjectId,
        ref:"MeetingSetting",
        required:true
    },
    meetingDate: {
        type: Date,
        required:true
    },
    meetingDuration: {
        type: Number,
        required: true
    },
    meetingParticipant: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:false,
        default : null
    },
    leadEmail: {
        type: String,
        default: "",
        required:false
    },
    extraFields:{
        type: Array,
        default: [{}],
        required: false
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
module.exports = mongoose.model("LeadMeeting", leadMeeting);