/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const callRoutingType = ["round_robin", "simultaneous"];
const callRoutingSetting = ["lead_routing_setting_1", "lead_routing_setting_2", "lead_routing_setting_3"];
const teamSettingSchema = new Schema({
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true,
    },
    callerIdForUser: {
        type: String,
        required: false,
        default: null
    },
    callerIdForLead: {
        type: String,
        required: false,
        default: null
    },
    whisperText: {
        type: String,
        required: false,
        default: null
    },
    whisperLanguage: {
        type: String,
        enum: ["en", "fi"],
        default: "en",
        required: false
    },
    userRetries: {
        type: Object,
        required: false,
        default: {
            active: false,
            noOfRetries: 0,
            retries: [
                {
                    attemptValue: 0,
                    attemptType: ""
                }
            ]
        }
    },
    followUpSettings: {
        type: Array,
        default: [
            {
                day: "",
                data: [
                    {
                        type: "", // sms or call,
                        value: "",
                        minOrHour: "",
                        smsMessage: ""
                    }
                ]
            }
        ]
    },
    followUpRules: {
        type: Array,
        default: [
            {
                day: "",
                type: "", // sms or call,
                data: {
                    value: "",
                    minOrHour: "",
                    smsMessage: ""
                }
            }
        ]
    },
    sendSMSToLeadIfTeamOffline: {
        type: Object,
        required: false,
        default: {
            active: false,
            sms: ""
        }
    },
    leadRoutingSettings: {
        type: {
            outboundLeadOwnerRouting: {
                type: String,
                enum: callRoutingSetting,
                default: 'lead_routing_setting_1'
            },
            outboundCallRoutingType: {
                type: String,
                enum: callRoutingType,
                default: 'round_robin'
            },
            inboundCallRoutingExistingNumber: {
                type: String,
                enum: callRoutingSetting,
                default: 'lead_routing_setting_1'
            },
            inboundCallRoutingTypeExistingNumber: {
                type: String,
                enum: callRoutingType,
                default: 'round_robin'
            },
        }
    },
    fallbackTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true,
    },
    rescheduleCallIfTeamIsOffline: {
        type: Boolean,
        default: false
    },
    outboundIntegrationUrl: {
        type: String,
        default: ""
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
module.exports = mongoose.model("TeamSetting", teamSettingSchema);