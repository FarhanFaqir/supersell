/**
 
 */
const { LOGIN_TYPE_BASIC, LOGIN_TYPE_SOCIAL_APP, LOGIN_TYPE_BOTH } = require("../utils/constant");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const roles = ['user', 'admin', 'both', 'none'];
const companySchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
        required: true
    },
    email: {
        type: String,
        default: "",
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false,
    },
    userLoginType: {
        type: String,
        enum: [LOGIN_TYPE_BASIC, LOGIN_TYPE_SOCIAL_APP, LOGIN_TYPE_BOTH],
        required: false,
        default: LOGIN_TYPE_BASIC
    },
    leadTitle: {
        type: String,
        default: "",
        required: false
    },
    leadSubTitle: {
        type: String,
        default: "",
        required: false
    },
    detailsTitle: {
        type: String,
        default: "",
        required: false
    },
    detailsSubTitle: {
        type: String,
        default: "",
        required: false
    },
    routingSetting: {
        type: String,
        enum: ["routing_setting_1", "routing_setting_2","routing_setting_3"],
        default: "routing_setting_1"
    },
    retryLeadsAfterVoicemail: {
        type: Boolean,
        required: false,
        default: false
    },
    hangupOnVoicemail: {
        type: Boolean,
        required: false,
        default: false
    },
    attemptRetriesEarly: {
        type: Boolean,
        required: false,
        default: false
    },
    callMarkedAsConversation: {
        type: Object,
        required: false,
        default: {
            active: false,
            time: 10
        }
    },
    permissions: {
        type: [{
            keyName: String,
            role: {
                type: String,
                enum: roles,
                default: 'none'
            }
        }],
        default: [
            { keyName: 'Control their own schedule', role: 'none' },
            { keyName: 'Downloads', role: 'none' },
            { keyName: 'Reporting', role: 'none' },
            { keyName: 'Meetings', role: 'none' },
            { keyName: 'Own + teams leads', role: 'none' },
            { keyName: 'View all leads', role: 'none' },
            { keyName: 'Listen others recordings', role: 'none' },
            { keyName: 'Fields', role: 'none' },
            { keyName: 'Tags & Stages', role: 'none' },
            { keyName: 'Meeting settings', role: 'none' },
            { keyName: 'Team settings', role: 'none' },
        ]
    },
    defaultCountryId: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        default: null
    },
    defaultCurrency: {
        type: String,
        enum: ["EUR", "USD"],
        default: "USD"
    },
    defaultLanguage: {
        type: String,
        enum: ["en", "fi"],
        default: "en"
    },
    defaultDateTimeFormat: {
        type: String,
        enum: ["MM/DD/YYYY hh:mm:ss A", "DD.MM.YYYY hh.mm"],
        default: "MM/DD/YYYY hh:mm:ss A"
    },
    companyStatus: {
        type: Boolean,
        index: true,
        default: true,
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
        // immutable:true //This field value can not be modified once added
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Company", companySchema);