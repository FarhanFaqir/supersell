/**
 
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const tagsAndStages = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    tags: {
        type: Array,
        required:true,
        default: [{
            statusName : null,
            backgroundColor : "#f9f7f7",
            textColor : "#000",
            visible : true,
            stopCalls : false
        }]
    },
    stages: {
        type: Array,
        required:true,
        default: [{
            statusName : null,
            backgroundColor : "#f9f7f7",
            textColor : "#000",
            visible : true,
            stopCalls : true
        }]
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
    }
});
module.exports = mongoose.model("TagsAndStage", tagsAndStages);