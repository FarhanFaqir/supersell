const httpStatus = require("http-status");
const TeamSchedule = require("../../models/teamSchedule");
const Team = require("../../models/team");
const { sendResponse } = require("../../utils/response");
const { paginationParams, checkAccess, isAdmin } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addTeamSchedule = async (req, res) => {
    let { teamId } = req.body;
    const {
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
        user
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can add team schedule.", BAD_REQUEST);
    try {
        if(!teamId && typeof teamId === "undefined") sendResponse(res, "Team id missing.", BAD_REQUEST);
        const isDestroy = await TeamSchedule.deleteOne({ teamId, isDeleted: "n" });
        if (isDestroy) {
            const teamSchedule = await TeamSchedule.create({
                teamId,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                sun,
                createdBy: user.id,
            });
            sendResponse(res, teamSchedule, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

// const updateTeamSchedule = async (req, res) => {
//     const teamScheduleId = req?.params?.id;
//     const {
//         mon,
//         tue,
//         wed,
//         thu,
//         fri,
//         sat,
//         sun,
//         user
//     } = req.body;
//     try {
//         let match = {
//             _id: teamScheduleId,
//             isDeleted: "n"
//         };
//         if(isAdmin) match.createdBy = user.id;
//         const teamSchedule = await TeamSchedule.findOne(match, " _id ");
//         if (!teamSchedule) sendResponse(res, "Team schedule not found", NOT_FOUND);
//         else {
//             await TeamSchedule.findByIdAndUpdate(
//                 {
//                     _id: teamSchedule._id
//                 },
//                 {
//                     mon,
//                     tue,
//                     wed,
//                     thu,
//                     fri,
//                     sat,
//                     sun,
//                     updatedAt: Date.now()
//                 });
//             sendResponse(res, "Team schedule updated successfully.", OK);
//         }
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

const getTeamSchedule = async (req, res) => {
    const teamId = req?.params?.id;
    try {
        let match = {
            teamId,
            isDeleted: "n"
        };
        if (!teamId && typeof teamId === "undefined") sendResponse(res, "Team id missing.", BAD_REQUEST);
        else {
            const teamSchedule = await TeamSchedule.findOne(match, "-isDeleted -createdAt -updatedAt -createdBy -teamId");
            const teamData = await Team.findOne({ _id: teamId, isDeleted: "n" }, "teamName doNotDisturbStatus");
            const plainTeamSchedule = teamSchedule ? teamSchedule.toObject() : {}; 
            plainTeamSchedule.team = teamData;
            sendResponse(res, plainTeamSchedule, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addTeamSchedule,
    // updateTeamSchedule,
    getTeamSchedule
}
