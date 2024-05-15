const mongoose = require("mongoose");
const { Schema } = mongoose;
const companyFieldSettingSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
      },
    about: {
        type: Array,
        default: [
            {
                keyName: "description",
                value: "Description",
                type: "text",
                order: 1,
                visible: true
            },
            {
                keyName: "message",
                value: "Message",
                type: "text",
                order: 2,
                visible: true
            },
            {
                keyName: "category",
                value: "Category",
                type: "text",
                order: 3,
                visible: true
            },
            {
                keyName : "comment",
                value : "Comment",
                type: "text",
                order: 4,
                visible: true
            },
            {
                keyName: "source",
                value: "Source",
                type: "text",
                order: 5,
                visible: true 
            }
        ]
    },
    contact: {
        type: Array,
        default: [
            {
                keyName: "firstName",
                value: "Firstname",
                type: "text",
                order: 1,
                visible: true
            },
            {
                keyName : "lastName",
                value : "Lastname",
                type: "text",
                order: 2,
                visible: true
            },
            {
                keyName: "phone",
                value: "Phone",
                type: "text",
                order: 3,
                visible: true
            },
            {
                keyName: "email",
                value: "Email",
                type: "text",
                order: 4,
                visible: true
            },
            {
                keyName : "address",
                value : "Address",
                type: "text",
                order: 5,
                visible: true
            },
            {
                keyName : "zipCode",
                value : "Zip code",
                type: "number",
                order: 6,
                visible: true
            },
            {
                keyName: "city",
                value: "City",
                type: "text",
                order: 7,
                visible: true
            }
        ]
    },
    details: {
        type: Array,
        default: [
            {
                keyName: "typeOfBuilding",
                value: "Type of building",
                type: "text",
                order: 1,
                visible: true
            },
            {
                keyName : "buildYear",
                value : "Build year",
                type: "number",
                order: 2,
                visible: true
            },
            {
                keyName: "size",
                value: "Size",
                type: "text",
                order: 3,
                visible: true
            },
            {
                keyName : "rooms",
                value : "Rooms",
                type: "number",
                order: 4,
                visible: true
            },
            {
                keyName : "floor",
                value : "Floor",
                type: "number",
                order: 5,
                visible: true
            },
            {
                keyName: "elevator",
                value: "Elevator",
                type: "text",
                order: 6,
                visible: true
            },
            {
                keyName : "condition",
                value : "Condition",
                type: "text",
                order: 7,
                visible: true
            },
            {
                keyName : "plot",
                value : "Plot",
                type: "text",
                order: 8,
                visible: true
            },
            {
                keyName: "schedule",
                value: "Schedule",
                type: "text",
                order: 9,
                visible: true
            },
            {
                keyName : "timezone",
                value : "Timezone",
                type: "text",
                order: 10,
                visible: true
            },
            {
                keyName : "sourceId",
                value : "Source ID",
                type: "text",
                order: 11,
                visible: true
            },
            {
                keyName: "crmId",
                value: "CRM ID",
                type: "text",
                order: 12,
                visible: true
            }
        ]
    },
    customFields: {
        type: Array,
        default: [{}]
    },
    offersAndDeals: {
        type: Array,
        default: [
            {
                keyName : "Offer amount",
                visible: true
            },
            {
                keyName : "Offer send date",
                visible: true
            },
            {
                keyName : "Offer presentation date",
                visible: true
            },
            {
                keyName : "Deal Amount",
                visible: true
            },
            {
                keyName : "Deal send date",
                visible: true
            },
        ]
    },
    hideEmptyLeadFields: {
       type: Boolean,
       default: false
    },
    isDeleted: {
        type: String,
        enum : ["y", "n"],
        default: "n"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // immutable:true //This field value can not be modified once added
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("CompanyFieldSetting", companyFieldSettingSchema);