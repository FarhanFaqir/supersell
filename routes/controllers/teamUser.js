const httpStatus = require("http-status");
const TeamUser = require("../../models/teamUser");
const Team = require("../../models/team");
const User = require("../../models/user");
const { sendResponse } = require("../../utils/response");
const { checkAccess, paginationParams, getMongooseObjectId } = require("../../utils/common");
const teamUser = require("../../models/teamUser");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = httpStatus;

const addTeamUser = async (req, res) => {
    const {
        teamId,
        teamUsers,
        callRoutingType,
        callRecording,
        addAllUsers,
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can add team user.", BAD_REQUEST);
    try {
        if (!teamId) sendResponse(res, "Team id is missing.", BAD_REQUEST);
        else if (!callRoutingType) sendResponse(res, "Call routing type is missing.", BAD_REQUEST);
        // else if (addAllUsers === "false" && !teamUsers || teamUsers.length < 1) sendResponse(res, "Team users are missing.", BAD_REQUEST);
        else {
            if (addAllUsers) {
                const team = await Team.findOne({ _id: teamId, isDeleted: "n" }, "companyId");
                const allTeamUsers = await User.find({ companyId: team.companyId, isDeleted: "n" }, "_id").lean();

                const isDestroy = await TeamUser.deleteMany({ teamId });
                if (isDestroy) {
                    allTeamUsers.forEach((user) => {
                        user.teamId = teamId;
                        user.priority = 5;
                        user.userId = user._id;
                        delete user._id;
                    });

                    await TeamUser.insertMany(allTeamUsers);

                    await Team.findByIdAndUpdate(
                        { _id: teamId },
                        {
                            callRoutingType,
                            callRecording,
                            updatedAt: Date.now()
                        }
                    );
                    sendResponse(res, "Users added to team successfully.", OK);
                }
            } else {
                teamUsers.forEach((user) => {
                    user.teamId = teamId;
                    delete user._id;
                });

                const teamUsersInTeam = teamUsers.filter(user => user.belongsToTeam);
                const teamUsersNotInTeam = teamUsers.filter(user => !user.belongsToTeam);

                const userIdsToDelete = teamUsersNotInTeam.map(user => user.userId);
                await TeamUser.deleteMany({ userId: { $in: userIdsToDelete }, teamId });

                const users = teamUsersInTeam.map(user => ({
                    updateOne: {
                        filter: { userId: getMongooseObjectId(user.userId), teamId: getMongooseObjectId(teamId) },
                        update: { $set: user },
                        upsert: true
                    }
                }));

                const result = await TeamUser.bulkWrite(users);
                if (result) {
                    await Team.findByIdAndUpdate(
                        { _id: teamId },
                        {
                            callRoutingType,
                            callRecording,
                            updatedAt: Date.now()
                        }
                    );
                    sendResponse(res, "Users added to team successfully.", OK);
                }
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getTeamUsers = async (req, res) => {
    const { c, q } = req?.query;
    const teamId = req?.params?.id;

    const { limit, offset } = paginationParams(req);
    if (!checkAccess(req)) sendResponse(res, "Only admins can list team users.", BAD_REQUEST);
    try {
        if (!c && typeof c === "undefined") sendResponse(res, "Company id missing.", BAD_REQUEST);

        let match = {
            isDeleted: "n",
            companyId: getMongooseObjectId(c)
        }

        if (q) {
            match.$or = [
                { firstName: { $regex: q, $options: "ix" } },
                { lastName: { $regex: q, $options: "ix" } },
                { email: { $regex: q, $options: "ix" } },
                { phone: { $regex: q, $options: "ix" } }
            ]
        }

        const team = await Team.findOne({ _id: teamId, companyId: c, isDeleted: "n" }, "teamName doNotDisturbStatus callRoutingType callRecording");

        const teamUsers = await User.aggregate([
            {
                "$facet": {
                    data: [
                        { $match: match },
                        {
                            $lookup: {
                                from: 'teamusers',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'teamUser'
                            }
                        },
                        {
                            $skip: offset
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                phone: 1,
                                teamUser: 1
                            }
                        }
                    ],
                    pagination: [
                        {
                            $match: {
                                isDeleted: "n",
                                companyId: getMongooseObjectId(c)
                            }
                        },
                        { "$count": "total" }
                    ]
                }
            }
        ]);

        teamUsers.forEach((team) => {
            const data = team.data;
            data.forEach((d) => {
                if (d.teamUser.length > 0) {
                    const tu = d.teamUser;
                    const test = [];
                    tu.forEach((t, index) => {
                        if (t.teamId.equals(getMongooseObjectId(teamId))) {
                            t.belongsToTeam = true;
                            test.push(t)
                        }
                    });
                    d.user = test.length > 0 ? test[0] : [];
                }
            })
        })

        const data = {
            list: {
                teamUsers: teamUsers[0].data,
                team: team,
                // totalUsers: us
            },
            totalCount: 0
        }

        if (teamUsers[0].pagination.length > 0) data.totalCount = teamUsers[0].pagination[0].total;

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    addTeamUser,
    getTeamUsers,
}
