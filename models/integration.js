const mongoose = require("mongoose");
const { Schema } = mongoose;
const integrationSchema = new Schema({
    integrationName: {
        type: String,
        required: true,
        index: true
    },
    webhookUrl: {
        type: String,
        required: true
    },
    routingRules: {
        type: Array,
        required: false,
        default: [{}]
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
module.exports = mongoose.model("Integration", integrationSchema);