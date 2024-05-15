const httpStatus = require("http-status");
const { sendResponse } = require("../../utils/response");
const { checkAccess } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const Meeting = require("../../models/meeting");
const Company = require("../../models/company");

const addMeeting = async (req, res) => {
    let {
        meetingBasicInfo,
        showExtraFields,
        fields,
        meetingReminders,
        user,
        meetingId
    } = req.body;

    if (!checkAccess(req)) sendResponse(res, "Only admins can add meeting.", NOT_FOUND);
    try {
        if (!meetingBasicInfo) sendResponse(res, "Meeting basic information is missing.", BAD_REQUEST);
        else {
            let meeting;
            if (meetingId) {
                meeting = await Meeting.findById(meetingId);
                if (meeting) {
                    // Update the existing meeting
                    meeting.meetingBasicInfo = meetingBasicInfo;
                    meeting.showExtraFields = showExtraFields;
                    meeting.fields = fields;
                    meeting.meetingReminders = meetingReminders;
                    await meeting.save();
                } else return sendResponse(res, "Meeting not found.", NOT_FOUND);
            } else {
                // Create a new meeting
                meeting = await Meeting.create({
                    userId: user.id,
                    companyId: user.companyId,
                    meetingBasicInfo,
                    showExtraFields,
                    fields,
                    meetingReminders,
                });
            }
            sendResponse(res, meeting, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};


const updateMeeting = async (req, res) => {
    const meetingId = req?.params?.id;
    let {
        meetingBasicInfo,
        fields,
        meetingReminders,
        user
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can update meeting.", NOT_FOUND);
    try {
        if (!meetingId && typeof meetingId === "undefined") sendResponse(res, "Meeting id missing.", BAD_REQUEST);
        else if (!meetingBasicInfo) sendResponse(res, "Meeting basic information is missing.", BAD_REQUEST);
        else {
            let match = {
                _id: meetingId,
                isDeleted: "n",
                companyId: user.companyId
            };
            const meeting = await Meeting.findOneAndUpdate(
                match,
                {
                    meetingBasicInfo,
                    fields,
                    meetingReminders,
                    updatedAt: Date.now()

                });
            if (meeting) sendResponse(res, "Meeting updated successfully.", OK);
            else sendResponse(res, "Error updating meeting.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getMeetings = async (req, res) => {
    // if (!checkAccess(req)) sendResponse(res, "Only admins can list meetings.", BAD_REQUEST);
    const { user } = req.body;
    try {
        const meetings = await Meeting.find({ isDeleted: "n", companyId: user.companyId },
            "meetingBasicInfo showExtraFields fields meetingReminders userId"
        );
        const companyData = await Company.findOne({ _id: user.companyId, isDeleted: "n" },"companyName");
        const data = {
            company: companyData.companyName,
            companyId : companyData._id,
            meetings: meetings
        };
        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteMeeting = async (req, res) => {
    const meetingId = req?.params?.id;
    const { user } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can delete meeting.", BAD_REQUEST);
    try {
        if (!meetingId && typeof meetingId === "undefined") sendResponse(res, "Meeting id missing.", BAD_REQUEST);
        const meeting = await Meeting.findById(meetingId, " _id ");
        if (!meeting) sendResponse(res, "Meeting not found", NOT_FOUND);
        else {
            let match = {
                _id: meetingId,
                isDeleted: "n",
                companyId: user.companyId
            };
            // if (isAdmin(req)) match.companyId = req?.body?.user.companyId;
            const isDeleted = await Meeting.findOneAndUpdate(
                match,
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            if (isDeleted) sendResponse(res, "Meeting deleted successfully.", OK);
            else sendResponse(res, "Error deleting meeting.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
}
