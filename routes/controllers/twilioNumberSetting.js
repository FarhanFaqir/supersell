const httpStatus = require("http-status");
const { sendResponse } = require("../../utils/response");
const { checkAccess } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const TwilioNumberSetting = require("../../models/twilioNumberSetting");
const TwilioNumber = require("../../models/twilioNumber");

const addTwilioNumberSetting = async (req, res) => {
    let {
        twilioNumberId,
        callRecording,
        callerId,
        callScreening,
        welcomeMessageStatus,
        voicemailMessageStatus,
        voicemailFollowUpTeam,
        routingType,
        teamId,
        userId,
        leadOwnerRoutingSetting,
        fallbackTeam
    } = req.body;

    if (!checkAccess(req)) sendResponse(res, "Only admins can add meeting settings.", BAD_REQUEST);
    try {
        if (!twilioNumberId || typeof twilioNumberId === "undefined") sendResponse(res, "Twilio number id is missing.", BAD_REQUEST);
        else if (!routingType || typeof routingType === "undefined") sendResponse(res, "Routing type is missing.", BAD_REQUEST);
        else if (!callerId || typeof callerId === "undefined") sendResponse(res, "Caller id is missing.", BAD_REQUEST);
        else if (!fallbackTeam || typeof fallbackTeam === "undefined") sendResponse(res, "Fall back team is missing.", BAD_REQUEST);
        else {
            if (routingType === "team") {
                if (!teamId || typeof teamId === "undefined") sendResponse(res, "Team id is missing.", BAD_REQUEST);
                userId = null;
            }
            else {
                if (!userId || typeof userId === "undefined") sendResponse(res, "User id is missing.", BAD_REQUEST);
                teamId = null;
            }

            let welcomeMessageAudioPath, voicemailMessageAudioPath;
            if (welcomeMessageStatus) {
                if (req.files.welcomeMessage) {
                    const welcomeFileFilename = req.files.welcomeMessage[0].filename;
                    welcomeMessageAudioPath = `${req.protocol}://${req.get('host')}/public/uploads/audios/${welcomeFileFilename}`;
                }
                else return res.send("Welcome message audio is required.");
            }

            if (voicemailMessageStatus) {
                if (req.files.voicemailMessage) {
                    const voicemailFileFilename = req.files.voicemailMessage[0].filename;
                    voicemailMessageAudioPath = `${req.protocol}://${req.get('host')}/public/uploads/audios/${voicemailFileFilename}`;
                } else return res.send("Voicemail message audio is required.");
            }

            const isDestroy = await TwilioNumberSetting.deleteOne({ twilioNumberId, isDeleted: "n" });
            if (isDestroy) {
                const twilioNumberSetting = await TwilioNumberSetting.create({
                    twilioNumberId,
                    callRecording,
                    callerId,
                    callScreening,
                    welcomeMessageStatus,
                    welcomeMessageAudio : welcomeMessageAudioPath,
                    voicemailMessageStatus,
                    voicemailMessageAudio: voicemailMessageAudioPath,
                    voicemailFollowUpTeam,
                    routingType,
                    teamId,
                    userId,
                    leadOwnerRoutingSetting,
                    fallbackTeam
                });
                sendResponse(res, twilioNumberSetting, OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getTwilioNumberSettingById = async (req, res) => {
    const twilioNumberId = req?.params?.id;
    if (!checkAccess(req)) sendResponse(res, "Only admins can get twilio number setting.", BAD_REQUEST);
    try {
        const twilioNumberSettingData = await TwilioNumberSetting.findOne({ twilioNumberId, isDeleted: "n" }, "-isDeleted -createdAt -updatedAt")
        const twilioNumberData = await TwilioNumber.findOne({ _id: twilioNumberId, isDeleted: "n" }, "number numberName");
        const responseData = twilioNumberSettingData ? twilioNumberSettingData.toObject() : {};
        responseData.twilioNumber = twilioNumberData;
        sendResponse(res, responseData, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addTwilioNumberSetting,
    getTwilioNumberSettingById
}
