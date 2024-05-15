const httpStatus = require("http-status");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { sendResponse } = require("../../utils/response");
const { paginationParams, checkAccess, getMongooseObjectId } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const LeadMeeting = require("../../models/leadMeeting");
const Company = require("../../models/company");

const addLeadMeeting = async (req, res) => {
    let {
        leadId,
        meetingId,
        meetingDate,
        meetingDuration,
        meetingParticipant,
        leadEmail,
        extraFields
    } = req.body;
    try {
        if (!leadId) sendResponse(res, "Lead id missing.", BAD_REQUEST);
        else if (!meetingId) sendResponse(res, "Meeting id missing.", BAD_REQUEST);
        else if (!meetingDate) sendResponse(res, "Meeting date is missing.", BAD_REQUEST);
        else if (!meetingDuration) sendResponse(res, "Meeting duration is missing.", BAD_REQUEST);
        else {
            const leadMeeting = await LeadMeeting.create({
                leadId,
                meetingId,
                meetingDate: new Date(meetingDate),
                meetingDuration,
                meetingParticipant,
                leadEmail,
                extraFields
            });
            sendResponse(res, leadMeeting, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateLeadMeeting = async (req, res) => {
    const leadMeetingId = req?.params?.id;
    let {
        leadId,
        meetingId,
        meetingDate,
        meetingDuration,
        meetingParticipant,
        leadEmail,
        extraFields
    } = req.body;
    try {
        if (!leadMeetingId && typeof leadMeetingId === "undefined") sendResponse(res, "Lead meeting id missing.", BAD_REQUEST);
        if (!leadId) sendResponse(res, "Lead id missing.", BAD_REQUEST);
        else if (!meetingId) sendResponse(res, "Meeting id missing.", BAD_REQUEST);
        else if (!meetingDate) sendResponse(res, "Meeting date is missing.", BAD_REQUEST);
        else if (!meetingDuration) sendResponse(res, "Meeting duration is missing.", BAD_REQUEST);
        else {
            let match = {
                _id: leadMeetingId,
                isDeleted: "n"
            };
            const isUpdated = await LeadMeeting.findOneAndUpdate(
                match,
                {
                    leadId,
                    meetingId,
                    meetingDate: new Date(meetingDate),
                    meetingDuration,
                    meetingParticipant,
                    leadEmail,
                    extraFields,
                    updatedAt: Date.now()
                });
            if (isUpdated) sendResponse(res, "Lead meeting updated successfully.", OK);
            else sendResponse(res, "Error updating lead meeting.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getLeadMeetings = async (req, res) => {
    const { limit, offset, tid } = paginationParams(req); // tid for teamId
    try {
        let match = {
            isDeleted: "n"
        }

        if(tid) match["leads.teamId"] = getMongooseObjectId(tid);

        const leadMeetings = await LeadMeeting.aggregate([
            {
                "$facet": {
                    data: [
                        {
                            $match: match
                        },
                        {
                            $lookup: {
                                from: 'leads',
                                localField: 'leadId',
                                foreignField: '_id',
                                as: 'leads'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'leads.contactedSalesPersonId',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        { $unwind: "$user" },
                        {
                            $lookup: {
                                from: 'teams',
                                localField: 'leads.teamId',
                                foreignField: '_id',
                                as: 'team'
                            }
                        },
                        { $unwind: "$team" },
                        {
                            $lookup: {
                                from: 'meetingsettings',
                                localField: 'meetingId',
                                foreignField: '_id',
                                as: 'meetings'
                            }
                        },
                        {
                            $skip: offset
                        },
                        {
                            $limit: limit
                        },
                        {
                            $unwind: "$leads"
                        },
                        {
                            $unwind: "$meetings"
                        },
                        {
                            $match: {
                                "leads.isDeleted": "n",
                                "meetings.isDeleted": "n"
                            }
                        },
                        {
                            $project: {
                                meetingDate: 1,
                                meetingDuration: 1,
                                leadEmail: 1,
                                extraFields: 1,
                                meetingSettings: "$meetings",
                                lead: "$leads",
                                teamName: "$team.teamName",
                                leadOwner: {
                                    $concat: ["$user.firstName", " ", "$user.lastName"]
                                }
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
            list: leadMeetings[0].data,
            totalCount: 0
        }

        if (leadMeetings[0].pagination.length > 0) data.totalCount = leadMeetings[0].pagination[0].total

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadMeetingById = async (req, res) => {
    const leadMeetingId = req?.params?.id;
    try {
        if (!leadMeetingId && typeof leadMeetingId === "undefined") sendResponse(res, "Lead meeting id missing.", BAD_REQUEST);
        const leadMeeting = await LeadMeeting.findOne({ _id: leadMeetingId, isDeleted: "n" },
            "meetingDate meetingDuration leadEmail extraFields")
            .populate("leadId", "")
            .populate("meetingId", "meetingTitle meetingSubTitle automaticTag extraFields meetingReminders")
            .populate("meetingParticipant", "firstName lastName email");
        if (!leadMeeting) sendResponse(res, "Lead meeting not found.", NOT_FOUND);
        else sendResponse(res, leadMeeting, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteLeadMeeting = async (req, res) => {
    const leadMeetingId = req?.params?.id;
    try {
        if (!leadMeetingId && typeof leadMeetingId === "undefined") sendResponse(res, "Lead meeting id missing.", BAD_REQUEST);
        const leadMeeting = await LeadMeeting.findById(leadMeetingId, " _id ");
        if (!leadMeeting) sendResponse(res, "Lead meeting not found", NOT_FOUND);
        else {
            let match = {
                _id: leadMeetingId,
                isDeleted: "n"
            };
            const isDeleted = await LeadMeeting.findOneAndUpdate(
                match,
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            if (isDeleted) sendResponse(res, "Lead meeting deleted successfully.", OK);
            else sendResponse(res, "Error deleting lead meeting.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadMeetingByLeadId = async (req, res) => {
    const leadId = req?.params?.leadId;
    try {
        if (!leadId && typeof leadId === "undefined") sendResponse(res, "Lead id missing.", BAD_REQUEST);
        const leadMeeting = await LeadMeeting.findOne({ leadId, isDeleted: "n" },
            "meetingDate meetingDuration leadEmail extraFields")
            .populate("leadId", "")
            .populate("meetingId", "meetingTitle meetingSubTitle automaticTag extraFields meetingReminders")
            .populate("meetingParticipant", "firstName lastName email");
        if (!leadMeeting) sendResponse(res, "Lead meeting not found.", NOT_FOUND);
        else sendResponse(res, leadMeeting, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const downloadLeadMeetings = async (req, res) => {

    const { user } = req.body;
    try {
        let match = { isDeleted: "n" };

        if (!checkAccess(req)) match.contactedSalesPersonId = getMongooseObjectId(user.id);
        const companyId = getMongooseObjectId(user.companyId);

        const companySettings = await Company.findOne(
            { _id: companyId, isDeleted: "n" },
            "leadTitle leadSubTitle detailsTitle detailsSubTitle"
        );

        const leadMeetings = await LeadMeeting.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'leads'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'leads.contactedSalesPersonId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'leads.teamId',
                    foreignField: '_id',
                    as: 'team'
                }
            },
            { $unwind: "$team" },
            {
                $lookup: {
                    from: 'meetingsettings',
                    localField: 'meetingId',
                    foreignField: '_id',
                    as: 'meetings'
                }
            },
            {
                $unwind: "$leads"
            },
            {
                $unwind: "$meetings"
            },
            {
                $match: {
                    "leads.isDeleted": "n",
                    "meetings.isDeleted": "n"
                }
            },
            {
                $project: {
                    meetingDate: 1,
                    meetingDuration: 1,
                    leadEmail: 1,
                    extraFields: 1,
                    meetingSettings: "$meetings",
                    lead: "$leads",
                    teamName: "$team.teamName",
                    leadOwner: {
                        $concat: ["$user.firstName", " ", "$user.lastName"]
                    }
                }
            }
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

        leadMeetings.forEach((meeting) => {
            let detailsTitle = companySettings.detailsTitle;
            let detailsSubTitle = companySettings.detailsSubTitle;

            detailsTitle = handleReplaceDynVar(meeting.lead, detailsTitle);
            detailsSubTitle = handleReplaceDynVar(meeting.lead, detailsSubTitle);
            meetingTitle = handleReplaceDynVar(meeting.lead, meeting.meetingSettings.meetingBasicInfo.meetingTitle);
            meetingSubTitle = handleReplaceDynVar(meeting.lead, meeting.meetingSettings.meetingBasicInfo.meetingSubTitle.value);

            const obj = {
                meeting:  meetingTitle + meetingSubTitle,
                dateTime: meeting.meetingDate,
                address: meeting.lead.address,
                details: detailsTitle + detailsSubTitle,
                leadOwner: meeting.leadOwner + meeting.teamName,
            }

            data.push(obj);
        });

        function convertToCsv(data, name) {
            const csvWriter = createCsvWriter({
                path: `public/csv/${name}.csv`,
                header: [
                    { id: 'meeting', title: 'Meeting' },
                    { id: 'dateTime', title: 'Date Time' },
                    { id: 'address', title: 'Address' },
                    { id: 'details', title: 'Detials' },
                    { id: 'leadOwner', title: 'Lead Owner' },
                ]
            });

            return csvWriter.writeRecords(data)
                .then(() => {
                    console.log('CSV file written successfully');
                });
        }

        convertToCsv(data, "leadmeetings")
            .then(() => {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=leadmeetings.csv');

                const downloadUrl = `${req.protocol}://${req.get('host')}/public/csv/leadmeetings.csv`;
                res.status(200).send({ downloadUrl });
            });
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }

}

module.exports = {
    addLeadMeeting,
    updateLeadMeeting,
    getLeadMeetings,
    getLeadMeetingById,
    deleteLeadMeeting,
    getLeadMeetingByLeadId,
    downloadLeadMeetings
}
