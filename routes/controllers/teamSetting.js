const httpStatus = require("http-status");
const TeamSetting = require("../../models/teamSetting");
const Team = require("../../models/team");
const { sendResponse } = require("../../utils/response");
const { checkAccess } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addTeamSetting = async (req, res) => {
    const {
        teamId,
        callerIdForUser,
        callerIdForLead,
        whisperText,
        whisperLanguage,
        userRetries,
        followUpSettings,
        followUpRules,
        sendSMSToLeadIfTeamOffline,
        leadRoutingSettings,
        fallbackTeam,
        rescheduleCallIfTeamIsOffline,
        outboundIntegrationUrl
    } = req.body;

    if (!checkAccess(req)) sendResponse(res, "Only admins can add team schedule.", BAD_REQUEST);
    try {
        if (!teamId && typeof teamId === "undefined") sendResponse(res, "Team id missing.", BAD_REQUEST);
        const isDestroy = await TeamSetting.deleteOne({ teamId, isDeleted: "n" });
        if (isDestroy) {
            const teamSetting = await TeamSetting.create({
                teamId,
                callerIdForUser,
                callerIdForLead,
                whisperText,
                whisperLanguage,
                userRetries,
                followUpSettings,
                followUpRules,
                sendSMSToLeadIfTeamOffline,
                leadRoutingSettings,
                fallbackTeam,
                rescheduleCallIfTeamIsOffline,
                outboundIntegrationUrl
            });
            sendResponse(res, teamSetting, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getTeamSetting = async (req, res) => {
    const teamId = req?.params?.id;
    try {
        let match = {
            teamId,
            isDeleted: "n"
        };
        if (!teamId && typeof teamId === "undefined") sendResponse(res, "Team id missing.", BAD_REQUEST);
        else {
            const teamSetting = await TeamSetting.findOne(match, "-isDeleted -createdAt -updatedAt -createdBy -teamId");
            const teamData = await Team.findOne({ _id: teamId, isDeleted: "n" }, "teamName doNotDisturbStatus");
            const plainTeamSetting = teamSetting ? teamSetting.toObject() : {};
            plainTeamSetting.team = teamData;
            sendResponse(res, plainTeamSetting, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addTeamSetting,
    getTeamSetting
}
