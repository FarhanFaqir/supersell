/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const leadScheduleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: "",
        required: true
    },
    leadId: {
        type: Schema.Types.ObjectId,
        ref: "Lead",
        default: "",
        required: true
    },
    leadScheduleDateTime: {
        type: Date,
        default: "",
        required: true
    },
    notesToCall: {
        type: String,
        default: "",
        required: true
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
module.exports = mongoose.model("LeadSchedule", leadScheduleSchema);