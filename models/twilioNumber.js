const mongoose = require("mongoose");
const { Schema } = mongoose;
const twilioNumberSchema = new Schema({
    numberName: {
        type: String,
        required: true,
        index: true
    },
    countryId: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        index: true,
        default: null
    },
    type: {
        type: String,
        required: false,
        default: null
    },
    areaCode: {
        type: Number,
        required: false,
        default: null
    },
    number: {
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
module.exports = mongoose.model("TwilioNumber", twilioNumberSchema);