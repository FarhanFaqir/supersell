/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const leadHistorySchema = new Schema({
    leadId: {
        type: Schema.Types.ObjectId,
        ref:"Lead",
        default: "",
        required:true
    },
    historyDescription: {
        type: String,
        default: "",
        required:true
    },    
    createdAt: {
        type: Date,
        default: Date.now,
        // immutable:true //This field value can not be modified once added
    }
});
module.exports = mongoose.model("LeadHistory", leadHistorySchema);
