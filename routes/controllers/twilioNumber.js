const httpStatus = require("http-status");
const { sendResponse } = require("../../utils/response");
const { paginationParams, checkAccess } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const TwilioNumber = require("../../models/twilioNumber");

const addTwilioNumber = async (req, res) => {
    let {
        numberName,
        countryId,
        type,
        areaCode,
        number
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can add meeting.", NOT_FOUND);
    try {
        if (!numberName) sendResponse(res, "Number name is missing.", BAD_REQUEST);
        else if (!countryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        else if (!type) sendResponse(res, "Type is missing.", BAD_REQUEST);
        else if (!areaCode) sendResponse(res, "Area code is missing.", BAD_REQUEST);
        else if (!number) sendResponse(res, "Number is missing.", BAD_REQUEST);
        else {
            const twilioNumber = await TwilioNumber.create({
                numberName,
                countryId,
                type,
                areaCode,
                number
            });
            sendResponse(res, twilioNumber, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateTwilioNumber = async (req, res) => {
    const twilioNumberId = req?.params?.id;
    let {
        numberName,
        countryId,
        type,
        areaCode,
        number
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can update twilio number.", NOT_FOUND);
    try {
        if (!twilioNumberId && typeof twilioNumberId === "undefined") sendResponse(res, "Twilio number id missing.", BAD_REQUEST);
        else if (!numberName) sendResponse(res, "Number name is missing.", BAD_REQUEST);
        else if (!countryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        else if (!type) sendResponse(res, "Type is missing.", BAD_REQUEST);
        else if (!areaCode) sendResponse(res, "Area code is missing.", BAD_REQUEST);
        else if (!number) sendResponse(res, "Number is missing.", BAD_REQUEST);
        else {
            let match = {
                _id: twilioNumberId,
                isDeleted: "n"
            };
            const twilioNumber = await TwilioNumber.findOneAndUpdate(
                match,
                {
                    numberName,
                    countryId,
                    type,
                    areaCode,
                    number,
                    updatedAt: Date.now()

                });
            if (twilioNumber) sendResponse(res, "Twilio number updated successfully.", OK);
            else sendResponse(res, "Error updating twilio number.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getTwilioNumbers = async (req, res) => {
    if (!checkAccess(req)) sendResponse(res, "Only admins can list twilio numbers.", BAD_REQUEST);
    const { limit, offset } = paginationParams(req);
    try {
        const twilioNumbers = await TwilioNumber.find({ isDeleted: "n" },
            "numberName countryId type areaCode number"
        )
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });

        sendResponse(res, twilioNumbers, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getTwilioNumberById = async (req, res) => {
    const twilioNumberId = req?.params?.id;
    if (!checkAccess(req)) sendResponse(res, "Only admins can get twilio number.", BAD_REQUEST);
    try {
        if (!twilioNumberId && typeof twilioNumberId === "undefined") sendResponse(res, "Twilio number id missing.", BAD_REQUEST);
        const twilioNumber = await TwilioNumber.findOne({ _id: twilioNumberId, isDeleted: "n" }, "numberName countryId type areaCode number");
        
        sendResponse(res, twilioNumber, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteTwilioNumber = async (req, res) => {
    const twilioNumberId = req?.params?.id;
    if (!checkAccess(req)) sendResponse(res, "Only admins can delete twilio number.", BAD_REQUEST);
    try {
        if (!twilioNumberId && typeof twilioNumberId === "undefined") sendResponse(res, "Twilio number id missing.", BAD_REQUEST);
        const twilioNumber = await TwilioNumber.findById(twilioNumberId, " _id ");
        if (!twilioNumber) sendResponse(res, "Twilio number not found", NOT_FOUND);
        else {
            let match = {
                _id: twilioNumberId,
                isDeleted: "n",
            };
            const isDeleted = await TwilioNumber.findOneAndUpdate(
                match,
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            if (isDeleted) sendResponse(res, "Twilio number deleted successfully.", OK);
            else sendResponse(res, "Error deleting twilio number.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}
const list = async (req, res) => {
    if (!checkAccess(req)) sendResponse(res, "Only admins can list twilio numbers.", BAD_REQUEST);
    try {
        const twilioNumbers = await TwilioNumber.find({ isDeleted: "n" },
            "numberName countryId type areaCode number"
        );

        sendResponse(res, twilioNumbers, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addTwilioNumber,
    updateTwilioNumber,
    getTwilioNumbers,
    getTwilioNumberById,
    deleteTwilioNumber,
    list
}
