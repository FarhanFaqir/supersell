const mongoose = require("mongoose");
const { Schema } = mongoose;
const teamScheduleSchema = new Schema({
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true
    },
    mon: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    tue: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    wed: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    thu: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    fri: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    sat: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    sun: {
        type: Object,
        default: {
            active: false,
            allDay: false,
            availability: [{}]
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        default: null
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
module.exports = mongoose.model("TeamSchedule", teamScheduleSchema);