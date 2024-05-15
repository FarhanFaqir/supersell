const httpStatus = require("http-status");
const Company = require("../../models/company");
const CompanyFieldSetting = require("../../models/companyFieldSetting");
const TagsAndStages = require("../../models/tagAndStages");
const { sendResponse } = require("../../utils/response");
const { isSuperAdmin, paginationParams, checkAccess, isAdmin } = require("../../utils/common");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addCompany = async (req, res) => {
    if (!isSuperAdmin(req)) sendResponse(res, "Only super admin can add company.", BAD_REQUEST);
    const {
        firstName,
        lastName,
        phone,
        email,
        companyName,
        countryId
    } = req.body;

    try {
        if (!firstName) sendResponse(res, "First name is missing.", BAD_REQUEST);
        else if (!phone) sendResponse(res, "Phone is missing.", BAD_REQUEST);
        else if (!email) sendResponse(res, "Email is missing.", BAD_REQUEST);
        else if (!companyName) sendResponse(res, "Company name is missing.", BAD_REQUEST);
        else if (!countryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        else {
            let imagePath;
            // if (req.file) {
            //     const filename = req.file.filename;
            //     imagePath = `${req.protocol}://${req.get('host')}/public/uploads/images/${filename}`;
            // } else sendResponse(res, "Image is missing.", BAD_REQUEST);

            const isExist = await Company.findOne({ companyName, isDeleted: "n" }, "_id");
            if (isExist) sendResponse(res, "Company already exist.", BAD_REQUEST);
            else {
                const company = await Company.create({
                    firstName,
                    lastName,
                    phone,
                    email,
                    companyName,
                    logo: imagePath,
                    defaultCountryId: countryId
                });

                CompanyFieldSetting.create({ companyId: company._id });
                TagsAndStages.create({ companyId: company._id });
                sendResponse(res, company, OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateCompany = async (req, res) => {
    if (!isSuperAdmin(req)) sendResponse(res, "Only super admin can update company.", BAD_REQUEST);
    const companyId = req?.params?.id;
    const {
        firstName,
        lastName,
        phone,
        email,
        companyName,
        countryId
    } = req.body;
    try {
        if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
        else if (!firstName) sendResponse(res, "First name is missing.", BAD_REQUEST);
        else if (!phone) sendResponse(res, "Phone is missing.", BAD_REQUEST);
        else if (!email) sendResponse(res, "Email is missing.", BAD_REQUEST);
        else if (!companyName) sendResponse(res, "Company name is missing.", BAD_REQUEST);
        else if (!countryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        else {
            let imagePath;
            // if (req.file) {
            //     const filename = req.file.filename;
            //     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            //     imagePath = `${basePath}${filename}`;
            // } else {
            //     const company = await Company.findOne({ _id : companyId, isDeleted: "n" }, "avatar");
            //     imagePath = company.avatar;
            // }
            await Company.findOneAndUpdate(
                {
                    _id: companyId,
                    isDeleted: "n"
                },
                {
                    firstName,
                    lastName,
                    phone,
                    email,
                    companyName,
                    logo: imagePath,
                    defaultCountryId: countryId,
                    updatedAt: Date.now()
                });
            sendResponse(res, "Company updated successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const updateCompanySettings = async (req, res) => {
    if (!checkAccess(req)) sendResponse(res, "Only admins can update company.", BAD_REQUEST);
    const companyId = req?.params?.id;
    const {
        companyName,
        countryId,
        defaultDateTimeFormat,
        defaultCountryId,
        defaultCurrency,
        defaultLanguage,
        userLoginType,
        leadTitle,
        leadSubTitle,
        detailsTitle,
        detailsSubTitle,
        routingSetting,
        retryLeadsAfterVoicemail,
        hangupOnVoicemail,
        attemptRetriesEarly,
        callMarkedAsConversation,
        permissions
    } = req.body;
    try {
        if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
        else if (!companyName) sendResponse(res, "Company name is missing.", BAD_REQUEST);
        else if (!defaultCountryId) sendResponse(res, "Country id is missing.", BAD_REQUEST);
        else {
            await Company.findOneAndUpdate(
                {
                    _id: companyId,
                    isDeleted: "n"
                },
                {
                    companyName,
                    countryId,
                    defaultDateTimeFormat,
                    defaultCountryId: countryId,
                    defaultCurrency,
                    defaultLanguage,
                    userLoginType,
                    leadTitle,
                    leadSubTitle,
                    detailsTitle,
                    detailsSubTitle,
                    routingSetting,
                    retryLeadsAfterVoicemail,
                    hangupOnVoicemail,
                    attemptRetriesEarly,
                    callMarkedAsConversation,
                    permissions,
                    updatedAt: Date.now()
                });
            sendResponse(res, "Company settings updated successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteCompany = async (req, res) => {
    if (!isSuperAdmin(req)) sendResponse(res, "Only super admin can delete company.", BAD_REQUEST);
    const companyId = req?.params?.id;
    try {
        if (!companyId) sendResponse(res, "Company id missing.", BAD_REQUEST);
        const company = await Company.findById(companyId, " _id ");
        if (!company) sendResponse(res, "Company not found", NOT_FOUND);
        else {
            await Company.findOneAndUpdate(
                {
                    _id: companyId,
                    isDeleted: "n"
                },
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            sendResponse(res, "Company deleted successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const updateCompanyStatus = async (req, res) => {
    if (!isSuperAdmin(req)) sendResponse(res, "Only super admin can update company status.", BAD_REQUEST);
    const companyId = req?.params?.id;
    const {
        companyStatus
    } = req.body;
    try {
        if (!companyId) sendResponse(res, "Company id missing.", BAD_REQUEST);
        else if (typeof companyStatus === "undefined") sendResponse(res, "Company status missing.", BAD_REQUEST);
        const company = await Company.findById(companyId, " _id ");
        if (!company) sendResponse(res, "Company not found", NOT_FOUND);
        else {
            await Company.findOneAndUpdate(
                {
                    _id: companyId,
                    isDeleted: "n"
                },
                {
                    companyStatus,
                    updatedAt: Date.now()
                });
            sendResponse(res, "Company status updated successfully.", OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getCompanies = async (req, res) => {
    if (!isSuperAdmin(req)) sendResponse(res, "Only super admin can list companies.", BAD_REQUEST);
    const q = req?.query?.q;
    const { limit, offset } = paginationParams(req);
    try {

        let match = {
            isDeleted: "n",
        };

        if (q) {
            match.$or = [
                { companyName: { $regex: q, $options: "ix" } }
            ]
        }
        const companies = await Company.aggregate([
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
                        {
                            $lookup: {
                                from: 'users',
                                localField: '_id',
                                foreignField: 'companyId',
                                as: 'users'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                companyName: 1,
                                email: 1,
                                phone: 1,
                                logo: 1,
                                companyStatus: 1,
                                userCount: { $size: '$users' }
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
            list: companies[0].data,
            totalCount: 0
        }

        if (companies[0].pagination.length > 0) data.totalCount = companies[0].pagination[0].total

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getCompanyById = async (req, res) => {
    if (!checkAccess(req)) sendResponse(res, "Only admin can list company.", BAD_REQUEST);
    const companyId = req?.params?.id;
    try {
        if (!companyId && typeof companyId === "undefined") sendResponse(res, "Company id missing.", BAD_REQUEST);

        const company = await Company.findOne(
            { _id: companyId, isDeleted: "n" },
            "firstName lastName phone email companyName defaultCountryId logo companyStatus userLoginType leadTitle leadSubTitle detailsTitle detailsSubTitle routingSetting retryLeadsAfterVoicemail hangupOnVoicemail attemptRetriesEarly callMarkedAsConversation permissions defaultCurrency defaultLanguage defaultDateTimeFormat"
        ).populate("defaultCountryId", "timezone countryName");
        sendResponse(res, company, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getPermissions = async (req, res) => {
    const companyId = req?.params?.id;
    try {
        if (!companyId || typeof companyId === "undefined") sendResponse(res, "Company id missing.", BAD_REQUEST);

        const companyPermissions = await Company.findOne(
            { _id: companyId, isDeleted: "n" },
            "permissions"
        );

        let userPermissions = [];

        if(isAdmin(req)) userPermissions = companyPermissions.permissions.filter(permission => permission.role === 'admin' || permission.role === 'both');
        else{
            userPermissions = companyPermissions.permissions.filter(permission => permission.role === 'user' || permission.role === 'both');
        }
        
        const newData = userPermissions.reduce((acc, { keyName }) => {
            acc[keyName] = true;
            return acc;
        }, {});
        sendResponse(res, newData, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getRoutingSettingList = async (req, res) => {
    try {
        const routingSettingList = [
            {
                keyName: "routing_setting_1",
                description: "The first User to TALK with a Lead or get SMS will be assigned as the Lead's Owner."
            },
            {
                keyName: "routing_setting_2",
                description: "The first User to CALL a Lead or get SMS will be assigned as the Lead's Owner."
            },
            {
                keyName: "routing_setting_3",
                description: "No"
            }
        ];

        sendResponse(res, routingSettingList, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addCompany,
    updateCompany,
    updateCompanyStatus,
    deleteCompany,
    getCompanies,
    getCompanyById,
    getPermissions,
    updateCompanySettings,
    getRoutingSettingList
}
