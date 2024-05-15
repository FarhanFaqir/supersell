const httpStatus = require("http-status");
const UserSchedule = require("../../models/userSchedule");
const User = require("../../models/user");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addUserSchedule = async (req, res) => {
    const {
        userId,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
        user
    } = req.body;
    try {
        if (!userId) sendResponse(res, "User id is missing.", BAD_REQUEST);
        const isDestroy = await UserSchedule.deleteOne({ userId, isDeleted: "n" });
        if (isDestroy) {
            const userSchedule = await UserSchedule.create({
                userId,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                sun,
                createdBy: user.id,
            });
            sendResponse(res, userSchedule, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

// const updateUserSchedule = async (req, res) => {
//     const userScheduleId = req?.params?.id;
//     const {
//         mon,
//         tue,
//         wed,
//         thu,
//         fri,
//         sat,
//         sun
//     } = req.body;
//     try {
//         let match = {
//             _id: userScheduleId,
//             isDeleted: "n"
//         };
//         const userSchedule = await UserSchedule.findOne(match, " _id ");
//         if (!userSchedule) sendResponse(res, "User schedule not found", NOT_FOUND);
//         else {
//             await UserSchedule.findByIdAndUpdate(
//                 {
//                     _id: userSchedule._id
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
//             sendResponse(res, "User schedule updated successfully.", OK);
//         }
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

// const deleteUserSchedule = async (req, res) => {
//     const userScheduleId = req?.params?.id;
//     const { user } = req?.body;
//     try {
//         if (!userScheduleId) sendResponse(res, "User schedule id missing.", BAD_REQUEST);
//         let match = {
//             _id: userScheduleId,
//             isDeleted: "n"
//         };
//         if (isAdmin(req)) match.createdBy = user.id;
//         const userSchedule = await userSchedule.findOne(match, " _id ");
//         if (!userSchedule) sendResponse(res, "User schedule not found", NOT_FOUND);
//         else {
//             await UserSchedule.findByIdAndUpdate(
//                 {
//                     _id: userSchedule._id
//                 },
//                 {
//                     isDeleted: "y",
//                     updatedAt: Date.now()
//                 });
//             sendResponse(res, "User schedule deleted successfully.", OK);
//         }
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

const getUserSchedule = async (req, res) => {
    const userId = req?.params?.id;
    try {
        let match = {
            userId,
            isDeleted: "n"
        };
        if (!userId) sendResponse(res, "User id missing.", BAD_REQUEST);
        else {
            const userSchedule = await UserSchedule.findOne(match, "-isDeleted -createdAt -updatedAt -createdBy -userId");
            const userData = await User.findOne({ _id: userId, isDeleted: "n" }, "firstName lastName doNotDisturbStatus");
            const plainUserSchedule = userSchedule ? userSchedule.toObject() : {}; 
            plainUserSchedule.user = userData;
            sendResponse(res, plainUserSchedule, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

// const getUserSchedules = async (req, res) => {
//     const { user } = req?.body;
//     const { limit, offset } = paginationParams(req);
//     if (!checkAccess(req)) sendResponse(res, "Only admins can list user schedules.", BAD_REQUEST);
//     try {
//         let match = {
//             isDeleted: "n"
//         };
//         if (!isAdmin(req)) match.createdBy = user.id;
//         const userSchedules = await UserSchedule.find(match).limit(limit).skip(offset);
//         if (!userSchedules) sendResponse(res, "User schedules not found", NOT_FOUND);
//         else sendResponse(res, userSchedules, OK);
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

// const getUserScheduleById = async (req, res) => {
//     const userScheduleId = req?.params?.id;
//     const { user } = req?.body;
//     try {
//         let match = {
//             _id: userScheduleId,
//             isDeleted: "n"
//         };
//         if (!userScheduleId) sendResponse(res, "User schedule id missing.", BAD_REQUEST);
//         else {
//             if (isAdmin(req)) match.createdBy = user.id;
//             const userSchedule = await UserSchedule.findOne(match);
//             if (!userSchedule) sendResponse(res, "User schedule not found", NOT_FOUND);
//             else sendResponse(res, userSchedule, OK);
//         }
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

module.exports = {
    addUserSchedule,
    // updateUserSchedule,
    getUserSchedule,
    // deleteUserSchedule,
    // getUserSchedules,
    // getUserScheduleById
}
