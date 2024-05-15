const mongoose = require("mongoose");
const { Schema } = mongoose;
const twilioNumberSettingSchema = new Schema({
    twilioNumberId: {
        type: Schema.Types.ObjectId,
        ref: "TwilioNumber",
        index: true,
        default: null
    },
    callRecording: {
        type: Boolean,
        required: false,
        default: false
    },
    callerId: {
        type: Schema.Types.ObjectId,
        ref: "TwilioNumber",
        required: true,
        index: true
    },
    callScreening: {
        type: Boolean,
        required: false,
        default: false
    },
    welcomeMessageStatus: {
        type: Boolean,
        required: false,
        default: false
    },
    welcomeMessageAudio: {
        type: String,
        required: false,
        default: ""
    },
    voicemailMessageStatus: {
        type: Boolean,
        required: false,
        default: false
    },
    voicemailMessageAudio: {
        type: String,
        required: false,
        default: ""
    },
    voicemailFollowUpTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        default: null,
        index: true
    },
    routingType: {
        type: String,
        enum: ['team', 'user'],
        default: "team"
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
    leadOwnerRoutingSetting: {
        type: String,
        enum: ["routing_setting_1", "routing_setting_2", "routing_setting_3"],
        default: "routing_setting_1",
    },
    fallbackTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true
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
module.exports = mongoose.model("TwilioNumberSetting", twilioNumberSettingSchema);