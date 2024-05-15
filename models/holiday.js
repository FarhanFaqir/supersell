/**
 * Holidays will be added by SUPER ADMIN (in this case both companyAdminID and userId will be null)
 * or
 * Company ADMIN
 * or
 * USER can also add custom holidays so in that case we will put UserId
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const holidaySchema = new Schema({
    holidayName: {
        type: String,
        required: true
    },
    holidayDate: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default:null
    },
    companyAdminId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    doNotDisturb: {
        type: Boolean,
        default: false
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref: "Company",
        default: null,
        required: false
    },
    countryId:{
        type: Schema.Types.ObjectId,
        ref: "Country",
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
        // immutable:true //This field value can not be modifed once added
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Holiday", holidaySchema);