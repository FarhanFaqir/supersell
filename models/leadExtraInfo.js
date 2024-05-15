/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const leadExtraInfo = new Schema({
    leadId:{
        type: Schema.Types.ObjectId,
        ref: "Lead",
    },
    metaKey:{
        type:String,
        required:true,
        index:true
    },
    metaValue:{
        type:Object,
        required:true,
        default:{}
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
    }
});
module.exports = mongoose.model("LeadExtraInfo", leadExtraInfo);