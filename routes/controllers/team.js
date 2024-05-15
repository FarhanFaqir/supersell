const httpStatus = require("http-status");
const moment = require('moment-timezone');
const Team = require("../../models/team");
const { sendResponse } = require("../../utils/response");
const { checkAccess, paginationParams, isAdmin, isSuperAdmin, getMongooseObjectId } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addTeam = async (req, res) => {
    let {
        teamName,
        doNotDisturbStatus,
        companyId,
        user
    } = req.body;

    if (!checkAccess(req)) sendResponse(res, "Only admins can add team.", BAD_REQUEST);
    try {
        if (!teamName) sendResponse(res, "Team name is missing.", BAD_REQUEST);
        if (isSuperAdmin(req)) {
            if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
        }
        else companyId = user.companyId;
        const teamExist = await Team.findOne({ teamName, isDeleted: "n" }, " _id ");
        if (teamExist) sendResponse(res, "Team already exist.", BAD_REQUEST);
        else {
            const teamData = await Team.create({
                teamName,
                companyId,
                doNotDisturbStatus,
                createdBy: user.id
            });
            sendResponse(res, teamData, OK);
        }

    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateTeam = async (req, res) => {
    const teamId = req?.params?.id;
    const {
        teamName,
        doNotDisturbStatus,
        companyId,
        user
    } = req?.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can update team.", BAD_REQUEST);
    try {
        if (!teamId && typeof teamId === "undefined") sendResponse(res, "Team id is missing.", BAD_REQUEST);
        if (!teamName) sendResponse(res, "Team name is missing.", BAD_REQUEST);
        if (!companyId) sendResponse(res, "Company name is missing.", BAD_REQUEST);
        let match = {
            _id: teamId,
            isDeleted: "n"
        };
        if (isAdmin(req)) match.companyId = user.companyId;
        const team = await Team.findOne(match, " _id ");
        if (!team) sendResponse(res, "Team not found", NOT_FOUND);
        else {
            await Team.findByIdAndUpdate(
                {
                    _id: team._id
                },
                {
                    teamName,
                    doNotDisturbStatus,
                    companyId,
                    updatedAt: Date.now()
                });
            sendResponse(res, "Team updated successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteTeam = async (req, res) => {
    const teamId = req?.params?.id;
    const { user } = req?.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can delete team.", BAD_REQUEST);
    try {
        if (!teamId) sendResponse(res, "Team id missing.", BAD_REQUEST);
        let match = {
            _id: teamId,
            isDeleted: "n"
        };
        if (isAdmin(req)) match.companyId = user.companyId;
        const team = await Team.findOne(match, " _id ");
        if (!team) sendResponse(res, "Team not found", NOT_FOUND);
        else {
            await Team.findByIdAndUpdate(
                {
                    _id: team._id
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            sendResponse(res, "Team deleted successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getTeams = async (req, res) => {
    const { user } = req?.body;
    const { limit, offset } = paginationParams(req);
    const { q, sort, order } = req?.query;
    if (!checkAccess(req)) sendResponse(res, "Only admins can list teams.", BAD_REQUEST);
    try {
        const now = moment();
        let currentDay = now.format('ddd').toLowerCase();

        let match = {
            isDeleted: "n",
        };

        const sortObj = { teamName: 1 };

        if (sort) {
            if (!order) sendResponse(res, "Order is missing.", BAD_REQUEST);
            delete sortObj.teamName;
            sortObj[sort] = Number(order);
        }

        if (q) {
            match.$or = [
                { teamName: { $regex: q, $options: "ix" } }
            ]
        }

        if (isAdmin(req)) match.companyId = getMongooseObjectId(user.companyId);
        const teams = await Team.aggregate([
            {
                "$facet": {
                    data: [
                        { $match: match },
                        {
                            $skip: offset
                        },
                        {
                            $limit: limit
                        },
                        { $sort: sortObj },
                        {
                            $lookup: {
                                from: 'teamusers',
                                let: { teamId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$teamId', '$$teamId'] },
                                                    { $eq: ['$isDeleted', 'n'] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'userId',
                                            foreignField: '_id',
                                            as: 'user'
                                        }
                                    },
                                    { $unwind: '$user' },
                                    {
                                        $match: {
                                            'user.isDeleted': 'n'
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: '$user._id',
                                            firstName: '$user.firstName',
                                            email: '$user.email'
                                        }
                                    }
                                ],
                                as: 'users'
                            },
                        },
                        {
                            $lookup: {
                                from: 'companies',
                                let: { companyId: '$companyId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$_id', '$$companyId'] },
                                                    { $eq: ['$isDeleted', 'n'] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'countries',
                                            localField: 'defaultCountryId',
                                            foreignField: '_id',
                                            as: 'country'
                                        }
                                    },
                                    { $unwind: '$country' },
                                    {
                                        $match: {
                                            'country.isDeleted': 'n'
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: '$country._id',
                                            countryName: '$country.countryName',
                                            timezone: '$country.timezone'
                                        }
                                    }
                                ],
                                as: 'countries'
                            },

                        },
                        {
                            $lookup: {
                                from: 'teamschedules',
                                localField: '_id',
                                foreignField: 'teamId',
                                as: 'teamSchedule'
                            }
                        },
                        {
                            $project: {
                                teamName: 1,
                                doNotDisturbStatus: 1,
                                callRoutingType: 1,
                                callRecording: 1,
                                doNotDisturbStatus: 1,
                                companyId: 1,
                                isDeleted: 1,
                                users: 1,
                                teamSchedule: 1,
                                timezone: "$countries.timezone"
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

        teams[0].data.forEach((team) => {
            team.available = false;
            if (team.teamSchedule.length > 0) {
                const teamSchedule = team.teamSchedule[0][currentDay];
                if (teamSchedule.active === true) {
                    if (teamSchedule.allDay === true) team.available = true;
                    else {
                        const availability = teamSchedule.availability;
                        if (availability.length > 0) {
                            availability.forEach((a) => {
                                const serverTimeZone = moment().tz(team.timezone[0]).format("HH:mm");
                                if (serverTimeZone >= a.startTime && serverTimeZone <= a.endTime) team.available = true;
                            });
                        }
                    }
                }
            }
            delete team.teamSchedule;
            delete team.timezone;
        });

        const data = {
            list: teams[0].data,
            totalCount: 0
        }

        if (teams[0].pagination.length > 0) data.totalCount = teams[0].pagination[0].total;

        sendResponse(res, data, OK);

    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const list = async (req, res) => {
    const { user } = req?.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can list teams.", BAD_REQUEST);
    try {
        let match = {
            companyId: user.companyId,
            isDeleted: "n"
        };

        const teams = await Team.find(match, "_id teamName");
        sendResponse(res, teams, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getTeamById = async (req, res) => {
    const teamId = req?.params?.id;
    const { user } = req?.body;
    if (!checkAccess(req)) sendResponse(res, "Only admin can list team.", BAD_REQUEST);
    try {
        let match = {
            _id: teamId,
            isDeleted: "n"
        };
        if (!teamId && typeof teamId === "undefined") sendResponse(res, "Team id missing.", BAD_REQUEST);
        else {
            if (isAdmin(req)) match.companyId = user.companyId;
            const team = await Team.findOne(match, "-isDeleted -updatedAt -createdAt -createdBy").populate("companyId", "companyName");
            if (!team) sendResponse(res, "Team not found", NOT_FOUND);
            else sendResponse(res, team, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const doNotDisturb = async (req, res) => {
    const teamId = req?.params?.id;
    const {
        doNotDisturbStatus,
        user
    } = req?.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can update team status.", BAD_REQUEST);
    try {
        if (!teamId) sendResponse(res, "Team id is missing.", BAD_REQUEST);
        else if (doNotDisturbStatus === "") sendResponse(res, "Do not disturb status is missing.", BAD_REQUEST);
        {
            let match = {
                _id: teamId,
                isDeleted: "n"
            };
            if (isAdmin(req)) match.companyId = user.companyId;
            const team = await Team.findOne(match, " _id ");
            if (!team) sendResponse(res, "Team not found", NOT_FOUND);
            else {
                await Team.findByIdAndUpdate(
                    {
                        _id: team._id
                    },
                    {
                        doNotDisturbStatus,
                        updatedAt: Date.now()
                    });
                sendResponse(res, "Do not disturb status of team updated successfully.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadRoutingSettingList = async (req, res) => {
    try {
        const leadRoutingSettingList = [
            {
                keyName: "lead_routing_setting_1",
                description: "Call lead owner first, then rest of the team"
            },
            {
                keyName: "lead_routing_setting_2",
                description: "Call team in priority order."
            },
            {
                keyName: "lead_routing_setting_3",
                description: "Only call the lead owner"
            }
        ];

        sendResponse(res, leadRoutingSettingList, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addTeam,
    updateTeam,
    deleteTeam,
    getTeams,
    getTeamById,
    doNotDisturb,
    getLeadRoutingSettingList,
    list
}
