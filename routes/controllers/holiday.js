const httpStatus = require("http-status");
const Holiday = require("../../models/holiday");
const UserDayOff = require("../../models/userDaysOff");
const { sendResponse } = require("../../utils/response");
const { checkAccess, isAdmin, isSuperAdmin, paginationParams, getMongooseObjectId } = require("../../utils/common");
const holiday = require("../../models/holiday");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addHoliday = async (req, res) => {
    let {
        holidayName,
        holidayDate,
        doNotDisturb,
        countryId,
        user
    } = req.body;
    let companyAdminId, userId, companyId = null;
    if (isSuperAdmin(req)) {
        if (!countryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        companyAdminId = null;
        userId = null;
        companyId = null;
    } else if (isAdmin(req)) {
        companyAdminId = user.id;
        countryId = user.countryId;
        companyId = user.companyId;
    } else {
        companyAdminId = user.companyAdminId;
        userId = user.id;
        countryId = user.countryId;
        companyId = user.companyId;
    }

    try {
        if (!holidayName) sendResponse(res, "Holiday name is missing.", BAD_REQUEST);
        else if (!holidayDate) sendResponse(res, "Holiday date is missing.", BAD_REQUEST);
        else {
            const holiday = await Holiday.create({
                holidayName,
                holidayDate: new Date(holidayDate),
                userId,
                companyAdminId,
                doNotDisturb,
                companyId,
                countryId
            });

            if (!isSuperAdmin(req)) {
                await UserDayOff.create({
                    userId: user.id,
                    holidayId: holiday._id,
                    doNotDisturb
                });
            }
            sendResponse(res, holiday, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateHoliday = async (req, res) => {
    const holidayId = req?.params?.id;
    const {
        holidayName,
        holidayDate,
        doNotDisturb,
        countryId,
        user
    } = req.body;
    try {
        if (!holidayId) sendResponse(res, "Holiday id is missing.", BAD_REQUEST);
        else if (!holidayName) sendResponse(res, "Holiday name is missing.", BAD_REQUEST);
        else if (!holidayDate) sendResponse(res, "Holiday date is missing.", BAD_REQUEST);
        else {
            let match = {
                _id: holidayId,
                isDeleted: "n"
            };
            if (isAdmin(req)) {
                match.companyAdminId = user.id;
                match.countryId = user.countryId;
            }
            if (!checkAccess(req)) {
                match.userId = user.id;
                match.companyAdminId = user.companyAdminId;
                match.countryId = user.countryId;
            }
            const holiday = await Holiday.findOne(match, " _id ");
            if (!holiday) sendResponse(res, "Holiday not found", NOT_FOUND);
            else {
                await Holiday.findByIdAndUpdate(
                    {
                        _id: holiday._id
                    },
                    {
                        holidayName,
                        holidayDate: new Date(holidayDate),
                        doNotDisturb,
                        countryId,
                        updatedAt: Date.now()
                    });

                if (!isSuperAdmin(req)) {
                    await UserDayOff.findOneAndUpdate(
                        {
                            holidayId,
                            isDeleted: "n"
                        },
                        {
                            doNotDisturb,
                            updatedAt: Date.now()
                        });
                }
                sendResponse(res, "Holiday updated successfully.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteHoliday = async (req, res) => {
    const holidayId = req?.params?.id;
    const { user } = req.body;
    try {
        let match = {
            _id: holidayId,
            isDeleted: "n"
        };
        if (!holidayId) sendResponse(res, "Holiday id missing.", BAD_REQUEST);
        else {
            if (isAdmin(req)) {
                match.companyAdminId = user.id;
                match.countryId = user.countryId;
            }
            if (!checkAccess(req)) {
                match.userId = user.id;
                match.companyAdminId = user.companyAdminId;
                match.countryId = user.countryId;
            }
            const holiday = await Holiday.findOne(match, " _id ");
            if (!holiday) sendResponse(res, "Holiday not found", NOT_FOUND);
            else {
                await Holiday.findByIdAndUpdate(
                    {
                        _id: holiday._id
                    },
                    {
                        isDeleted: "y",
                        updatedAt: Date.now()
                    });

                if (!isSuperAdmin(req)) {
                    await UserDayOff.findOneAndUpdate(
                        {
                            holidayId: holiday._id,
                            isDeleted: "n"
                        },
                        {
                            isDeleted: "y",
                            updatedAt: Date.now()
                        });
                }
                sendResponse(res, "Holiday deleted successfully.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getHolidays = async (req, res) => {
    const { y, c } = req?.query;
    const { user } = req?.body;
    const { limit, offset } = paginationParams(req);
    try {

        let match = {
            isDeleted: "n"
        };

        if (!isSuperAdmin(req)) {
            match.$or = [
                { userId: getMongooseObjectId(user.id) },
                { companyId: getMongooseObjectId(user.companyId) },
                { $and: [{ companyAdminId: { $eq: null }, userId: { $eq: null } }] }
            ]
        }

        if (c) match.countryId = getMongooseObjectId(c);
        if (y) {
            match.$expr = {
                $eq: [{ $year: "$holidayDate" }, parseInt(y)]
            }
        }

        const holidays = await Holiday.aggregate([
            {
                "$facet": {
                    data: [
                        {
                            $match: match
                        },
                        {
                            $skip: offset
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                holidayName: 1,
                                holidayDate: 1,
                                doNotDisturb: 1,
                                isDeleted: 1,
                                companyAdminId: 1,
                                userId: 1,
                                companyId: 1,
                                countryId: 1,
                            }
                        },
                    ],
                    pagination: [
                        { $match: match },
                        { "$count": "total" }
                    ]
                }
            }
        ]);
        const data = {
            list: holidays[0].data,
            totalCount: 0
        }

        if (holidays[0].pagination.length > 0) data.totalCount = holidays[0].pagination[0].total

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getHolidayById = async (req, res) => {
    const holidayId = req?.params?.id;
    try {
        if (!holidayId) sendResponse(res, "Holiday id is missing", NOT_FOUND);

        let match = {
            _id: getMongooseObjectId(holidayId),
            isDeleted: "n"
        }
        const holiday = await Holiday.findOne(match, "-isDeleted -updatedAt -createdAt")
            .populate("countryId", "countryName");

        if (!holiday) sendResponse(res, "Holiday not found.", BAD_REQUEST);
        else sendResponse(res, holiday, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const updateHolidayDoNotDisturbStatus = async (req, res) => {
    const holidayId = req?.params?.id;
    const {
        doNotDisturb,
        user
    } = req.body;
    try {
        if (!holidayId && typeof holidayId === "undefined") sendResponse(res, "Holiday id is missing.", BAD_REQUEST);
        else {
            let match = {
                _id: holidayId,
                isDeleted: "n"
            };
            if (isAdmin(req)) {
                match.companyAdminId = user.id;
                match.countryId = user.countryId;
            }
            if (!checkAccess(req)) {
                match.userId = user.id;
                match.companyAdminId = user.companyAdminId;
                match.countryId = user.countryId;
            }
            const holiday = await Holiday.findOne(match, " _id ");
            if (!holiday) sendResponse(res, "Holiday not found", NOT_FOUND);
            else {
                const isUpdated = await Holiday.findByIdAndUpdate(
                    {
                        _id: holiday._id,
                        isDeleted: "n"
                    },
                    {
                        doNotDisturb,
                        updatedAt: Date.now()
                    });
                if (isUpdated) sendResponse(res, "Holiday updated successfully.", OK);
                else sendResponse(res, "Error updating holiday.", BAD_REQUEST);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addHoliday,
    updateHoliday,
    updateHolidayDoNotDisturbStatus,
    deleteHoliday,
    getHolidays,
    getHolidayById
}
