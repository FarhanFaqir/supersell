const httpStatus = require("http-status");
const ScheduledCall = require("../../models/scheduledCall");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const { checkAccess, paginationParams, getMongooseObjectId } = require("../../utils/common");

const addScheduledCall = async (req, res) => {
    let {
        user,
        leadId,
        scheduledCallDateTime,
        noteToCall,
        scheduledFor,
        teamId,
        userId
    } = req.body;
    try {
        if (!leadId) sendResponse(res, "Lead id is missing.", BAD_REQUEST)
        else if (!scheduledCallDateTime) sendResponse(res, "Scheduled call date and time is missing.", BAD_REQUEST)
        else if (!noteToCall) sendResponse(res, "Note to call is missing.", BAD_REQUEST)
        else {
            if (checkAccess(req)) {
                if (!scheduledFor) sendResponse(res, "Scheduled for is missing.", BAD_REQUEST)
                if (scheduledFor === "team") {
                    if (!teamId || typeof teamId === "undefined") sendResponse(res, "Team id is missing.", BAD_REQUEST);
                    userId = null;
                }
                else {
                    if (!userId || typeof userId === "undefined") sendResponse(res, "User id is missing.", BAD_REQUEST);
                    teamId = null;
                }
            }
            const isDestroy = await ScheduledCall.deleteOne({ leadId, isDeleted: "n" });
            if (isDestroy) {
                const calls = await ScheduledCall.create({
                    leadId,
                    scheduledCallDateTime: new Date(scheduledCallDateTime),
                    noteToCall,
                    scheduledFor,
                    teamId,
                    userId,
                    companyId: user.companyId,
                    createdBy: user.id
                });
                sendResponse(res, calls, OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateScheduledCall = async (req, res) => {
    let {
        scheduledCallId,
        scheduledCallDateTime,
        noteToCall,
        scheduledFor,
        teamId,
        userId
    } = req.body;
    try {
        if (!scheduledCallId || scheduledCallId === "undefined") sendResponse(res, "Scheduled call id is missing.", BAD_REQUEST)
        else if (!scheduledCallDateTime) sendResponse(res, "Scheduled call date and time is missing.", BAD_REQUEST)
        else if (!noteToCall) sendResponse(res, "Note to call is missing.", BAD_REQUEST)
        else {
            if (checkAccess(req)) {
                if (!scheduledFor) sendResponse(res, "Scheduled for is missing.", BAD_REQUEST)
                if (scheduledFor === "team") {
                    if (!teamId || typeof teamId === "undefined") sendResponse(res, "Team id is missing.", BAD_REQUEST);
                    userId = null;
                }
                else {
                    if (!userId || typeof userId === "undefined") sendResponse(res, "User id is missing.", BAD_REQUEST);
                    teamId = null;
                }
            }

            let match = {
                _id: scheduledCallId,
                isDeleted: "n"
            };
            const call = await ScheduledCall.findOne(match, " _id ");
            if (!call) sendResponse(res, "Scheduled call not found", NOT_FOUND);
            else {
                await ScheduledCall.findByIdAndUpdate(
                    {
                        _id: call._id
                    },
                    {
                        scheduledCallDateTime: new Date(scheduledCallDateTime),
                        noteToCall,
                        scheduledFor,
                        teamId,
                        userId,
                        updatedAt: Date.now()
                    });
                sendResponse(res, "Scheduled call updated successfully.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getScheduledCalls = async (req, res) => {
  const { q, sort, order, tid, loid, nid } = req?.query; // tid = teamId & loid = lead owner id & nid = number id
  const { limit, offset } = paginationParams(req);
  try {
      let match = { isDeleted: "n" };

      const sortObj = { scheduledCallDateTime: -1 };
      if (sort) {
          if (!order) sendResponse(res, "Sort order type is missing.", BAD_REQUEST);
          else {
              delete sortObj.scheduledCallDateTime;
              delete sortObj.order;
              sortObj[sort] = Number(order);
          }
      }

      if (tid) match.teamId = getMongooseObjectId(tid);
      if (loid) match.userId = getMongooseObjectId(loid);
      if (nid) match.scheduledCallId = getMongooseObjectId(nid);

      if (q) {
          match.$or = [
              { scheduledFor: { $regex: q, $options: "ix" } }
          ];
      }

      const aggregatePipeline = [
          { $match: match },
          {
              $lookup: {
                  from: 'leads',
                  let: { leadId: '$leadId' },
                  pipeline: [
                      {
                          $match: {
                              $expr: { $eq: ['$_id', '$$leadId'] },
                              isDeleted: "n"
                          }
                      },
                      {
                          $project: {
                              isDeleted: 0,
                              createdAt: 0,
                              updatedAt: 0,
                          }
                      }
                  ],
                  as: 'lead'
              }
          },
          {
              $lookup: {
                  from: 'teams',
                  let: { teamId: '$teamId' },
                  pipeline: [
                      {
                          $match: {
                              $expr: { $eq: ['$_id', '$$teamId'] },
                              isDeleted: "n"
                          }
                      },
                      {
                          $project: {
                              teamName: 1,
                          }
                      }
                  ],
                  as: 'team'
              }
          },
          {
              $lookup: {
                  from: 'users',
                  let: { userId: '$userId' },
                  pipeline: [
                      {
                          $match: {
                              $expr: { $eq: ['$_id', '$$userId'] },
                              isDeleted: "n"
                          }
                      },
                      {
                          $project: {
                              firstName: 1,
                              lastName: 1
                          }
                      }
                  ],
                  as: 'user'
              }
          },
          {
              $project: {
                  scheduledCallId: 1,
                  scheduledCallDateTime: 1,
                  noteToCall: 1,
                  scheduledFor: 1,
                  lead: {
                      $arrayElemAt: ['$lead', 0]
                  },
                  team: {
                      $arrayElemAt: ['$team.teamName', 0]
                  },
                  user: {
                      $arrayElemAt: ['$user', 0]
                  },
                  isDeleted: 1,
                  teamId: 1,
                  userId: 1,
              }
          },
          { $sort: sortObj },
          {
              $skip: offset
          },
          {
              $limit: limit
          }
      ];

      const calls = await ScheduledCall.aggregate(aggregatePipeline);

      const data = {
          list: calls,
          totalCount: calls.length
      }

      sendResponse(res, data, OK);
  } catch (err) {
      sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
  }
}


const getScheduledCallById = async (req, res) => {
    const scheduledCallId = req?.params?.id;
    const { user } = req.body;
    try {
        if (!scheduledCallId || typeof scheduledCallId === "undefined") sendResponse(res, "Scheduled call id is missing.", BAD_REQUEST);
        const call = await ScheduledCall.findOne({ _id: scheduledCallId, companyId: user.companyId, isDeleted: "n" }, "-isDeleted -createdAt -updatedAt");
        sendResponse(res, call, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getScheduledCallByLeadId = async (req, res) => {
    const leadId = req?.params?.leadId;
    const { user } = req.body;
    try {
        if (!leadId || typeof leadId === "undefined") sendResponse(res, "Lead id is missing.", BAD_REQUEST);
        const call = await ScheduledCall.findOne({ leadId, companyId: user.companyId, isDeleted: "n" }, "-isDeleted -createdAt -updatedAt");
        sendResponse(res, call, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addScheduledCall,
    updateScheduledCall,
    getScheduledCalls,
    getScheduledCallById,
    getScheduledCallByLeadId
}
