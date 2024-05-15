/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const leadHistorySchema = new Schema({
    leadId: {
        type: Schema.Types.ObjectId,
        ref:"Lead",
        required:true,
        index: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true
    },
    contactedSalesPersonId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: false
    }, 
    callStatus: {
        type: String,
        default: "",
        required: false
    },   
    callAttemptedByUsers: {
        type: [], // ids of users
        default: [],
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // immutable:true //This field value can not be modified once added
    }
});
module.exports = mongoose.model("LeadHistory", leadHistorySchema);