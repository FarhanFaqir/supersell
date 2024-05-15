const httpStatus = require("http-status");
const CompanyFieldSetting = require("../../models/companyFieldSetting");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;
const { isAdmin } = require("../../utils/common");

const addCompanyFieldSetting = async (req, res) => {
    if (!isAdmin(req)) sendResponse(res, "Only admins can add company field setting.", BAD_REQUEST);
    const {
        companyId,
        about,
        contact,
        details,
        customFields,
        offersAndDeals,
        hideEmptyLeadFields
    } = req.body;
    try {
        if (!companyId) sendResponse(res, "Company id missing.", BAD_REQUEST);
        const isDestroy = await CompanyFieldSetting.deleteOne({ companyId, isDeleted: "n" });
        if (isDestroy) {
            const companyFieldSetting = await CompanyFieldSetting.create({
                companyId,
                about,
                contact,
                details,
                customFields,
                offersAndDeals,
                hideEmptyLeadFields
            });
            sendResponse(res, companyFieldSetting, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const getCompanyFieldSettings = async (req, res) => {
    const companyId = req?.params?.id;
    try {
        if (!companyId && typeof companyId === "undefined") sendResponse(res, "Company id missing");
        const companyFieldSetting = await CompanyFieldSetting.findOne(
            { companyId, isDeleted: "n" }, "-_id -isDeleted -updatedAt -createdAt"
        )
        
        if (!companyFieldSetting) sendResponse(res, "Company field setting not found", NOT_FOUND);
        else sendResponse(res, companyFieldSetting, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addCompanyFieldSetting,
    getCompanyFieldSettings
}
