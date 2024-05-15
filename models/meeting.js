/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const meetingSetting = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    meetingBasicInfo: {
        type: Object,
        required: true,
        default: {
            meetingTitle: "",
            meetingSubTitle: {
                value: "",
                visible: true
            },
            automaticTag: {
                value: "",
                visible: true
            }
        }
    },
    showExtraFields : {
        type: Boolean,
        default: false
    },
    fields:{
        type: Object,
        default: {},
        required: false
    },
    meetingReminders:{
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
module.exports = mongoose.model("MeetingSetting", meetingSetting);