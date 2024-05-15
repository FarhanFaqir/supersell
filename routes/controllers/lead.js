const httpStatus = require("http-status");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Lead = require("../../models/lead");
const Company = require("../../models/company");
const TeamUser = require("../../models/teamUser");
const { sendResponse } = require("../../utils/response");
const { checkAccess, paginationParams, getMongooseObjectId, isSuperAdmin } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addLead = async (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        email,
        address,
        zipCode,
        city,
        description,
        message,
        category,
        comment,
        source,
        typeOfBuilding,
        buildYear,
        size,
        rooms,
        floor,
        elevator,
        condition,
        plot,
        schedule,
        timezone,
        sourceId,
        crmId,
        isLeadOwner,
        isLeadConnected,
        details,
        leadExtraFields,
        leadOwnerId,
        user
    } = req.body;

    try {
        const teamUser = await TeamUser.findOne({ userId: user.id }, "teamId");
        if (!teamUser) sendResponse(res, "User is not associated with any team.", BAD_REQUEST);
        const lead = await Lead.create({
            firstName,
            lastName,
            phone,
            email,
            address,
            zipCode,
            city,
            description,
            message,
            category,
            comment,
            source,
            typeOfBuilding,
            buildYear,
            size,
            rooms,
            floor,
            elevator,
            condition,
            plot,
            schedule,
            timezone,
            sourceId,
            crmId,
            isLeadOwner,
            isLeadConnected,
            details,
            leadExtraFields,
            contactedSalesPersonId: user.id,
            leadOwnerId,
            teamId: teamUser.teamId
        });
        sendResponse(res, lead, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateLead = async (req, res) => {
    const leadId = req?.params?.id;
    const {
        user,
        firstName,
        lastName,
        phone,
        email,
        address,
        zipCode,
        city,
        description,
        message,
        category,
        comment,
        source,
        typeOfBuilding,
        buildYear,
        size,
        rooms,
        floor,
        elevator,
        condition,
        plot,
        schedule,
        timezone,
        sourceId,
        crmId,
        isLeadOwner,
        isLeadConnected,
        leadExtraFields,
        details,
    } = req.body;
    try {
        const lead = await Lead.findOneAndUpdate(
            { _id: leadId },
            {
                firstName,
                lastName,
                phone,
                email,
                address,
                zipCode,
                city,
                description,
                message,
                category,
                comment,
                source,
                typeOfBuilding,
                buildYear,
                size,
                rooms,
                floor,
                elevator,
                condition,
                plot,
                schedule,
                timezone,
                sourceId,
                crmId,
                isLeadOwner,
                isLeadConnected,
                details,
                leadExtraFields,
                updatedAt: Date.now()

            });
        if (lead) sendResponse(res, "Lead updated successfully.", OK);
        else sendResponse(res, "Error updating lead.", BAD_REQUEST);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteLead = async (req, res) => {
    const leadId = req?.params?.id;
    try {
        if (!leadId) sendResponse(res, "Lead id missing.", BAD_REQUEST);
        let match = {
            _id: leadId,
            isDeleted: "n"
        };
        const lead = await Lead.findOne(match, " _id ");
        if (!lead) sendResponse(res, "Lead not found", NOT_FOUND);
        else {
            await Lead.findByIdAndUpdate(
                {
                    _id: lead._id
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            sendResponse(res, "Lead deleted successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeads = async (req, res) => {
    const { q, sort, order, tid, loid, tag, sid } = req?.query; // tid = teamId & loid = lead owner id & sid = stageId
    const { limit, offset } = paginationParams(req);
    const { user } = req.body;
    try {
        let match = { isDeleted: "n" };

        const sortObj = { firstName: 1 };
        if (sort) {
            if (!order) sendResponse(res, "Sort order type is missing.", BAD_REQUEST);
            delete sortObj.firstName;
            sortObj[sort] = Number(order);
        }

        if (q) {
            match.$or = [
                { firstName: { $regex: q, $options: "ix" } },
                { lastName: { $regex: q, $options: "ix" } }
            ]
        }

        if (tid) match.teamId = getMongooseObjectId(tid);
        if (loid) match.contactedSalesPersonId = getMongooseObjectId(loid);
        if (sid) match.leadStageId = sid;
        if (tag) {
            match.tags = {
                $elemMatch: { id: tag }
            };
        }

        if (!checkAccess(req)) match.contactedSalesPersonId = getMongooseObjectId(user.id);
        const companyId = getMongooseObjectId(user.companyId);

        const leadDetails = await Lead.aggregate([
            {
                "$facet": {
                    data: [
                        { $match: match },
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'companyId',
                                foreignField: '_id',
                                as: 'company'
                            }
                        },
                        // {
                        //     $lookup: {
                        //       from: 'users',
                        //       let: { ownerId: "$leadOwnerId" },
                        //       pipeline: [
                        //         {
                        //           $match: {
                        //             $expr: {
                        //               $or: [
                        //                 { $eq: ["$_id", "$$ownerId"] },
                        //                 { $eq: ["$$ownerId", null] },
                        //               ],
                        //             },
                        //           },
                        //         },
                        //       ],
                        //       as: 'user',
                        //     },
                        //   },
                        // { $unwind: "$user" },
                        {
                            $lookup: {
                                from: 'teams',
                                localField: 'teamId',
                                foreignField: '_id',
                                as: 'team'
                            }
                        },
                        { $unwind: "$team" },
                        {
                            $lookup: {
                                from: "companyfieldsettings",
                                let: { companyId: companyId },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$companyId", "$$companyId"] }
                                        }
                                    }
                                ],
                                as: "companyFieldSetting"
                            }
                        },
                        {
                            $lookup: {
                                from: 'leadhistories',
                                localField: '_id',
                                foreignField: 'leadId',
                                as: 'leadHistory'
                            }
                        },
                        {
                            $lookup: {
                                from: 'leadextrainfos',
                                localField: '_id',
                                foreignField: 'leadId',
                                as: 'leadExtraInfo'
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                phone: 1,
                                email: 1,
                                address: 1,
                                zip: 1,
                                city: 1,
                                category: 1,
                                comment: 1,
                                source: 1,
                                typeOfBuilding: 1,
                                buildYear: 1,
                                size: 1,
                                rooms: 1,
                                floor: 1,
                                elevator: 1,
                                condition: 1,
                                plot: 1,
                                schedule: 1,
                                timezone: 1,
                                sourceId: 1,
                                crmId: 1,
                                tags: 1,
                                leadStage: 1,
                                leadExtraInfo: 1,
                                leadHistory: 1,
                                companyFieldSetting: 1,
                                contactedSalesPersonId: 1,
                                leadExtraFields: 1,
                                teamName: "$team.teamName",
                                company: 1,
                                leadOwner: {
                                    name: {$concat: ['$user.firstName', ' ', '$user.lastName']},
                                    _id : '$user._id',
                                },
                                teamId: 1,
                                isDeleted: 1
                            }
                        },
                        { $sort: sortObj },
                        {
                            $skip: offset
                        },
                        {
                            $limit: limit
                        },
                    ],
                    pagination: [
                        { $match: match },
                        { "$count": "total" }
                    ]
                }
            },
        ]);

        const data = {
            list: leadDetails[0].data,
            totalCount: 0
        }

        if (leadDetails[0].pagination.length > 0) data.totalCount = leadDetails[0].pagination[0].total

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadById = async (req, res) => {
    const leadId = req?.params?.id;
    const { user } = req.body;
    try {
        let match = {
            _id: getMongooseObjectId(leadId),
            isDeleted: "n"
        };
        if (!leadId) sendResponse(res, "Lead id missing.", BAD_REQUEST);
        else {
            const companyId = getMongooseObjectId(user.companyId);

            const leadDetails = await Lead.aggregate([
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: 'leadextrainfos',
                        localField: '_id',
                        foreignField: 'leadId',
                        as: 'leadExtraInfo',
                        pipeline: [
                            {
                                $match: {
                                    isDeleted: 'n'
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "companyfieldsettings",
                        let: { companyId: companyId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$companyId", "$$companyId"] }
                                }
                            }
                        ],
                        as: "companyFieldSetting"
                    }
                },
                {
                    $lookup: {
                        from: 'leadhistories',
                        localField: '_id',
                        foreignField: 'leadId',
                        as: 'leadHistory'
                    }
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        phone: 1,
                        email: 1,
                        address: 1,
                        zipCode: 1,
                        city: 1,
                        description: 1,
                        message: 1,
                        category: 1,
                        comment: 1,
                        source: 1,
                        typeOfBuilding: 1,
                        buildYear: 1,
                        size: 1,
                        rooms: 1,
                        floor: 1,
                        elevator: 1,
                        condition: 1,
                        plot: 1,
                        schedule: 1,
                        timezone: 1,
                        sourceId: 1,
                        crmId: 1,
                        tags: 1,
                        leadStageId: 1,
                        leadExtraInfo: 1,
                        leadHistory: 1,
                        leadExtraFields: 1,
                        companyFieldSetting: 1,
                    }
                }
            ]);
            sendResponse(res, leadDetails, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const addLeadTags = async (req, res) => {
    const leadId = req?.params?.id;
    const {
        user,
        tags
    } = req.body;
    try {
        if (tags.length < 1) sendResponse(res, "Tags missing.", BAD_REQUEST);
        const lead = await Lead.findOneAndUpdate(
            { _id: leadId },
            {
                tags,
                updatedAt: Date.now()

            });
        if (lead) sendResponse(res, "Tags added to the lead successfully.", OK);
        else sendResponse(res, "Error adding tags to lead.", BAD_REQUEST);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const updateLeadStage = async (req, res) => {
    const {
        user,
        leadId,
        leadStageId
    } = req.body;
    try {
        if (!leadId || typeof leadId === "undefined") sendResponse(res, "Lead id is missing.", BAD_REQUEST);
        if (!leadStageId) sendResponse(res, "Lead stage id is missing.", BAD_REQUEST);
        const lead = await Lead.findOneAndUpdate(
            { _id: getMongooseObjectId(leadId) },
            {
                leadStageId,
                updatedAt: Date.now()

            });
        if (lead) sendResponse(res, "Lead stage update successfully.", OK);
        else sendResponse(res, "Error updating lead stage.", BAD_REQUEST);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const downloadLeads = async (req, res) => {

    const { user } = req.body;
    try {
        let match = { isDeleted: "n" };

        if (!checkAccess(req)) match.contactedSalesPersonId = getMongooseObjectId(user.id);
        const companyId = getMongooseObjectId(user.companyId);

        const companySettings = await Company.findOne(
            { _id: companyId, isDeleted: "n" },
            "leadTitle leadSubTitle detailsTitle detailsSubTitle"
        );

        const leads = await Lead.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'contactedSalesPersonId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "teamusers",
                    let: { userId: "$contactedSalesPersonId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$isDeleted", "n"] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "teams",
                                localField: "teamId",
                                foreignField: "_id",
                                as: "team"
                            }
                        },
                        {
                            $unwind: "$team"
                        },
                        {
                            $project: {
                                _id: "$team._id",
                                teamName: "$team.teamName",
                            }
                        }
                    ],
                    as: "teamDetails"
                }
            },
            { $unwind: "$teamDetails" },
            {
                $lookup: {
                    from: 'leadhistories',
                    localField: '_id',
                    foreignField: 'leadId',
                    as: 'leadHistory'
                }
            },
            {
                $lookup: {
                    from: 'leadextrainfos',
                    let: { leadId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $and: [{ $eq: ['$leadId', '$$leadId'] }, { $eq: ['$metaKey', 'NOTES'] }] }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                note: '$metaValue'
                            }
                        }
                    ],
                    as: 'leadNotes'
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    phone: 1,
                    email: 1,
                    address: 1,
                    zip: 1,
                    city: 1,
                    category: 1,
                    comment: 1,
                    source: 1,
                    typeOfBuilding: 1,
                    buildYear: 1,
                    size: 1,
                    rooms: 1,
                    floor: 1,
                    elevator: 1,
                    condition: 1,
                    plot: 1,
                    schedule: 1,
                    timezone: 1,
                    sourceId: 1,
                    crmId: 1,
                    notes: {
                        $map: {
                            input: "$leadNotes",
                            as: "note",
                            in: "$$note.note.text"
                        }
                    },
                    leadHistory: 1,
                    companyFieldSetting: 1,
                    contactedSalesPersonId: 1,
                    leadExtraFields: 1,
                    user: { $concat: ["$user.firstName", " ", "$user.lastName"] },
                    teamName: "$teamDetails.teamName",
                    isDeleted: 1
                }
            },
        ]);

        const handleReplaceDynVar = (data, value) => {
            const regex = /{{(.*?)}}/g;
            const matches = value?.match(regex);
            if (matches) {
                let newStr = value;
                for (const match of matches) {
                    const key = match?.replace("{{", "")?.replace("}}", "");
                    newStr = newStr.replace(match, data[key] ? data[key] : "");
                }
                return newStr;
            }
            return value;
        };

        let data = [];

        leads.forEach((lead) => {
            let leadTitle = companySettings.leadTitle;
            let leadSubTitle = companySettings.leadSubTitle;
            let detailsTitle = companySettings.detailsTitle;
            let detailsSubTitle = companySettings.detailsSubTitle;

            leadTitle = handleReplaceDynVar(lead, leadTitle);
            leadSubTitle = handleReplaceDynVar(lead, leadSubTitle);
            detailsTitle = handleReplaceDynVar(lead, detailsTitle);
            detailsSubTitle = handleReplaceDynVar(lead, detailsSubTitle);

            const obj = {
                lead: leadTitle + leadSubTitle,
                lead_status: "",
                details: detailsTitle + detailsSubTitle,
                lead_owner: lead.user,
                note: lead.notes
            }

            data.push(obj);
        });

        function convertToCsv(data, name) {
            const csvWriter = createCsvWriter({
                path: `public/csv/${name}.csv`,
                header: [
                    { id: 'lead', title: 'Lead' },
                    { id: 'lead_status', title: 'Status' },
                    { id: 'details', title: 'Details' },
                    { id: 'lead_owner', title: 'Lead Owner' },
                    { id: 'note', title: 'Note' },
                ]
            });

            return csvWriter.writeRecords(data)
                .then(() => {
                    console.log('CSV file written successfully');
                });
        }

        convertToCsv(data, "leads")
            .then(() => {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');

                const downloadUrl = `${req.protocol}://${req.get('host')}/public/csv/leads.csv`;
                res.status(200).send({ downloadUrl });
            });
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }

}

const getLeadRoutingSettingList = async (req, res) => {
    try {
        const routingSettingList = [
            {
                keyName: "lead_routing_setting_1",
                description: "Call lead owner first, then rest of the team."
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

        sendResponse(res, routingSettingList, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadOwnerRoutingSettingList = async (req, res) => {
    try {
        const routingSettingList = [
            {
                keyName: "lead_owner_routing_setting_1",
                description: "Call the users in priority order."
            },
            {
                keyName: "lead_owner_routing_setting_2",
                description: "Call lead owner first, then rest of the team."
            },
            {
                keyName: "lead_owner_routing_setting_3",
                description: "Only call the lead owner"
            }
        ];

        sendResponse(res, routingSettingList, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addLead,
    updateLead,
    deleteLead,
    getLeads,
    getLeadById,
    addLeadTags,
    downloadLeads,
    getLeadRoutingSettingList,
    getLeadOwnerRoutingSettingList,
    updateLeadStage
}
