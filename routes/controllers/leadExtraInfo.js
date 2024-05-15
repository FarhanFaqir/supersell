const httpStatus = require("http-status");
const LeadExtraInfo = require("../../models/leadExtraInfo");
const { paginationParams, getMongooseObjectId } = require("../../utils/common");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const { LEAD_META_KEY_NOTES, LEAD_META_KEY_OFFERS_DEALS } = require("../../utils/constant");

const addLeadExtraInfo = async (req, res) => {
    const {
        leadId,
        metaKey,
        metaValue,
    } = req?.body;
    try {
        if (!leadId) sendResponse(res, "Lead id missing.", BAD_REQUEST);
        else if (!metaKey) sendResponse(res, "Meta key is missing.", BAD_REQUEST);
        else if (![LEAD_META_KEY_NOTES, LEAD_META_KEY_OFFERS_DEALS].includes(metaKey)) sendResponse(res, "Meta key not matched.", BAD_REQUEST);
        else if (!metaValue) sendResponse(res, "Meta value is missing.", BAD_REQUEST);
        else {
            if (metaKey === LEAD_META_KEY_OFFERS_DEALS) {
                await LeadExtraInfo.deleteOne({ leadId: getMongooseObjectId(leadId), isDeleted: "n", metaKey: LEAD_META_KEY_OFFERS_DEALS });
            }
            const extraLeadInfo = await LeadExtraInfo.create({
                leadId,
                metaKey,
                metaValue
            });
            sendResponse(res, extraLeadInfo, OK);
        }


    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }

}

const deleteLeadExtraInfo = async (req, res) => {
    const leadExtraInfoId = req?.params?.id;
    try {
        if (!leadExtraInfoId) sendResponse(res, "Lead extra info id missing.", BAD_REQUEST);
        let match = {
            _id: leadExtraInfoId,
            isDeleted: "n"
        };
        const leadExtraInfo = await LeadExtraInfo.findOne(match, " _id ");
        if (!leadExtraInfo) sendResponse(res, "Lead extra info not found", NOT_FOUND);
        else {
            await LeadExtraInfo.findByIdAndUpdate(
                {
                    _id: leadExtraInfo._id
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            sendResponse(res, "Lead extra info deleted successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getLeadExtraInfo = async (req, res) => {
    const leadId = req?.params?.id;
    const { limit, offset } = paginationParams(req);
    try {
        if(!leadId || typeof leadId === "undefined") sendResponse(res, "Lead id is missing.", BAD_REQUEST);
        let match = {
            leadId,
            isDeleted: "n"
        };
        const leadExtraInfo = await LeadExtraInfo.find(match).limit(limit).skip(offset);
        if (!leadExtraInfo) sendResponse(res, "Lead extra info not found", NOT_FOUND);
        else sendResponse(res, leadExtraInfo, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addLeadExtraInfo,
    deleteLeadExtraInfo,
    getLeadExtraInfo
}