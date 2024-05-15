const httpStatus = require("http-status");
const leadHistory = require("../../models/leadHistory");
const { sendResponse } = require("../../utils/response");
const { OK,BAD_REQUEST,INTERNAL_SERVER_ERROR,NOT_FOUND } = httpStatus;

const addLeadHistory = async (req, res) => {
    const { leadId, historyDescription } = req.body;
    try {
        if(!leadId && typeof leadId === "undefined") sendResponse(res, "Lead id is missing.", BAD_REQUEST)
        if(!historyDescription) sendResponse(res, "History description is missing.", BAD_REQUEST)
        else {
            const history = await leadHistory.create({ leadId, historyDescription });
            sendResponse(res, history, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const list = async (req, res) => {
    const leadId = req?.params?.id;
    try {
        const history = await leadHistory.find({ leadId }, " _id historyDescription");
        sendResponse(res, history, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addLeadHistory,
    list
}
