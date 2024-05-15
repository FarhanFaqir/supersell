/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { sendMessage, initiateCall } = require("../utils/twilio");

const leadSchema = new Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    zipCode: {
        type: Number,
        default: null
    },
    city: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: ""
    },
    comment: {
        type: String,
        default: ""
    },
    source: {
        type: String,
        default: ""
    },
    typeOfBuilding: {
        type: String,
        default: ""
    },
    buildYear: {
        type: Number,
        default: null
    },
    size: {
        type: String,
        default: ""
    },
    rooms: {
        type: Number,
        default: null
    },
    floor: {
        type: Number,
        default: null
    },
    elevator: {
        type: String,
        default: ""
    },
    condition: {
        type: String,
        default: ""
    },
    plot: {
        type: String,
        default: ""
    },
    schedule: {
        type: String,
        default: ""
    },
    timezone: {
        type: String,
        default: ""
    },
    sourceId: {
        type: String,
        default: ""
    },
    crmId: {
        type: String,
        default: ""
    },
    isLeadOwner: {
        type: String,
        enum: ["n", "y"],
        default: "n"
    },
    leadStageId:{
        type: String,
        default: ""
    },
    isLeadConnected: {
        type: String,
        enum: ["n", "y"],
        default: "n"
    },
    details: {
        type: String,
        default: ""
    },
    tags: {
        type: Array,
        default: []
    },
    leadExtraFields: {
        type: Object,
        default: {}
    },
    leadSource: {
        type: String,
        default: "",
        required: false
    },
    leadOwnerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: false
    },
    contactedSalesPersonId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: false
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        default: null,
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

// leadSchema.post('save', function (lead, next) {
//   // check if the new lead has been added to the database
//   console.log('New lead added:', lead);

//   // Move to the next middleware immediately
//   next();

//   // Perform Twilio operations after the lead has been saved
//   sendMessage(lead.phone, lead.phone, lead);
//   initiateCall(lead.phone, lead.phone);
// });

module.exports = mongoose.model("Lead", leadSchema);