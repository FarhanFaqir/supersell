
const httpStatus = require("http-status");
const UserDayOff = require("../../models/userDaysOff");
const Holiday = require("../../models/holiday");
const User = require("../../models/user");
const { sendResponse } = require("../../utils/response");
const { getMongooseObjectId } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addUserDayOff = async (req, res) => {
    const {
        userDayOff,
        user
    } = req?.body;

    try {
        if (!userDayOff && userDayOff.length < 1) sendResponse(res, "Please add user day off.", BAD_REQUEST);
        else {
            const isDestroy = await UserDayOff.deleteMany({ userId: user.id });
            if(isDestroy) {
                const dayOff = await UserDayOff.insertMany(userDayOff);
                sendResponse(res, dayOff, OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

// const updateUserDayOff = async (req, res) => {
//     const userDayOffId = req?.params?.id;
//     const { user } = req?.body;
//     try {
//         if (!userDayOffId) sendResponse(res, "User day off id missing.", BAD_REQUEST);
//         let match = {
//             _id: userDayOffId,
//             userId: user.id,
//             isDeleted: "n"
//         };
//         const userDayOff = await UserDayOff.findOne(match, " _id ");
//         if (!userDayOff) sendResponse(res, "User day off not found", NOT_FOUND);
//         else {
//             await UserDayOff.findByIdAndUpdate(
//                 {
//                     _id: userDayOff._id
//                 },
//                 {
//                     isDeleted: "y",
//                     updatedAt: Date.now()
//                 });
//             sendResponse(res, "User day off deleted successfully.", OK);
//         }
//     } catch (err) {
//         sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
//     }
// }

const deleteUserDayOff = async (req, res) => {
    const userDayOffId = req?.params?.id;
    const { user } = req?.body;
    try {
        if (!userDayOffId && typeof userDayOffId === "undefined") sendResponse(res, "User day off id missing.", BAD_REQUEST);
        let match = {
            _id: userDayOffId,
            userId: user.id,
            isDeleted: "n"
        };
        const userDayOff = await UserDayOff.findOne(match, " _id holidayId");
        if (!userDayOff) sendResponse(res, "User day off not found", NOT_FOUND);
        else {
            await Holiday.findOneAndUpdate(
                {
                    _id: userDayOff.holidayId
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });

            await UserDayOff.findByIdAndUpdate(
                {
                    _id: userDayOff._id
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            sendResponse(res, "User day off deleted successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getUserDayOffs = async (req, res) => {
    const {
        user
    } = req?.body;
    try {
        const userDoNotDisturbStatus = await User.findOne({ _id : user.id, isDeleted : "n"}, "doNotDisturbStatus");
        const result = await Holiday.aggregate([
            {
                $match: {
                    isDeleted: "n",
                    $or: [
                        { companyAdminId: getMongooseObjectId(user.companyAdminId) },
                        { companyAdminId: getMongooseObjectId(user.id) },
                        { userId: getMongooseObjectId(user.id) },
                        { $and: [{ companyAdminId: { $eq: null }, userId: { $eq: null } }] }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'userdaysoffs',
                    localField: '_id',
                    foreignField: 'holidayId',
                    as: 'daysOff'
                }
            },
            {
                $project: {
                    holidayName: 1,
                    holidayDate: 1,
                    doNotDisturb: 1,
                    daysOff: 1,
                    isDeleted: 1,
                    companyAdminId: 1,
                    userId: 1
                }
            }
        ]);

        const data = {
            list: { 
                holidays : result,
                userDoNotDisturbStatus: userDoNotDisturbStatus.doNotDisturbStatus
            }
        }
        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addUserDayOff,
    getUserDayOffs,
    deleteUserDayOff
}
