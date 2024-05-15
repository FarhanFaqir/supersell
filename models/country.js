/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const countrySchema = new Schema({
    countryName: {
        type: String,
        required : true
    },
    countryShortName: {
        type: String,
        default: "",
        required:true
    },
    timezone: {
        type: String,
        required: true
    },  
    offset: {
        type: String,
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
module.exports = mongoose.model("Country", countrySchema);