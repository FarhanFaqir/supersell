const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment-timezone');
const User = require("../../models/user");
const { sendResponse } = require("../../utils/response");
const {
    paginationParams,
    randomCode,
    checkAccess,
    isAdmin,
    isSuperAdmin,
    getMongooseObjectId,
    getDomain,
    getRoleByName
} = require("../../utils/common");
const { LOGIN_TYPE_BASIC, LOGIN_TYPE_BOTH, ROLE_ADMIN } = require("../../utils/constant");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const { Worker } = require('worker_threads');
const worker = new Worker('./workers/sendEmail.worker.js');

const addUser = async (req, res) => {
    let createdBy = null;
    let {
        firstName,
        lastName,
        email,
        phone,
        companyId,
        timezone,
        isTrail,
        language,
        notifyVia,
        sendWelcomeEmail,
        doNotDisturbStatus,
        roleId,
        user
    } = req.body;
    if (!checkAccess(req)) sendResponse(res, "Only admins can add user.", NOT_FOUND);
    if (isAdmin(req)) createdBy = user.id;
    try {

        if (!firstName) sendResponse(res, "First name is missing.", BAD_REQUEST);
        else if (!email) sendResponse(res, "Email is missing.", BAD_REQUEST);
        else if (!language) sendResponse(res, "Language is missing.", BAD_REQUEST);
        else {
            if (isSuperAdmin(req)) {
                if (!roleId) sendResponse(res, "Role id is missing.", BAD_REQUEST);
                if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
            } else {
                companyId = user.companyId;
            }
            const userExist = await User.findOne({ email, isDeleted: "n" }, " _id ");
            if (userExist) sendResponse(res, "User already exist.", BAD_REQUEST);
            else {
                const user = await User.create({
                    firstName,
                    lastName,
                    email,
                    phone,
                    roleId,
                    companyId,
                    createdBy,
                    timezone,
                    isTrail,
                    language,
                    notifyVia,
                    sendWelcomeEmail,
                    doNotDisturbStatus
                });
                if (user) {
                    const otp = randomCode(6);
                    await User.findByIdAndUpdate({ _id: user._id }, { otp, updatedAt: Date.now() });
                    sendResponse(res, user, OK);
                    if (sendWelcomeEmail) {
                        const appUrl = getDomain(req);
                        const workerData = {
                            processName: "SEND-EMAIL",
                            data: {
                                to: `${user.email}`,
                                subject: "Signup Confirmation Email",
                                html: `Hello! <br> Thank you for your registration with Super Seller.
                                <a href="${appUrl}/setpassword?otp=${otp}">Please verify your email by clicking this link and set your password</a>

                                If above link did't work you can copy and past below link into browser:
                                <b>${appUrl}/setpassword?otp=${otp}</b>
                                <p>The aim of this email is to inform you that you are now part of Super Seller community. </p>`,
                            }
                        };

                        res.on('finish', async () => {
                            worker.postMessage(workerData);
                        });
                    }
                }
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const updateUser = async (req, res) => {
    const userId = req?.params?.id;
    const {
        firstName,
        lastName,
        phone,
        roleId,
        companyId,
        timezone,
        language,
        notifyVia,
        doNotDisturbStatus
    } = req.body;
    try {
        if (!firstName) sendResponse(res, "First name is missing.", BAD_REQUEST);
        else if (!language) sendResponse(res, "Language is missing.", BAD_REQUEST);
        else {
            const isUpdated = await User.findOneAndUpdate(
                {
                    _id: userId,
                    isDeleted: "n"
                },
                {
                    firstName,
                    lastName,
                    phone,
                    language,
                    roleId,
                    companyId,
                    timezone,
                    doNotDisturbStatus,
                    notifyVia,
                    updatedAt: Date.now()
                });
            if (isUpdated) sendResponse(res, "User updated successfully.", OK);
            else sendResponse(res, "Error updating user.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const doNotDisturb = async (req, res) => {
    const userId = req?.params?.id;
    const {
        doNotDisturbStatus,
        user
    } = req?.body;
    try {
        if (!userId) sendResponse(res, "User id is missing.", BAD_REQUEST);
        else if (doNotDisturbStatus === "") sendResponse(res, "Do not disturb status is missing.", BAD_REQUEST);
        {
            let match = {
                _id: userId,
                isDeleted: "n"
            };
            if (isAdmin(req)) match.companyId = user.companyId;
            const userData = await User.findOne(match, " _id ");
            if (!userData) sendResponse(res, "User not found", NOT_FOUND);
            else {
                await User.findByIdAndUpdate(
                    {
                        _id: userData._id
                    },
                    {
                        doNotDisturbStatus,
                        updatedAt: Date.now()
                    });
                sendResponse(res, "Do not disturb status of user updated successfully.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const deleteUser = async (req, res) => {
    const userId = req?.params?.id;
    if (!checkAccess(req)) sendResponse(res, "Only admins can delete user.", BAD_REQUEST);
    try {
        if (!userId && typeof userId === "undefined") sendResponse(res, "User id missing.", BAD_REQUEST);
        const user = await User.findById(userId, " _id ");
        if (!user) sendResponse(res, "User not found", NOT_FOUND);
        else {
            let match = {
                _id: userId,
                isDeleted: "n"
            };
            if (isAdmin(req)) match.companyId = req?.body?.user.companyId;
            const isDeleted = await User.findOneAndUpdate(
                match,
                {
                    isDeleted: "y",
                    updatedAt: Date.now()
                });
            if (isDeleted) sendResponse(res, "User deleted successfully.", OK);
            else sendResponse(res, "Error deleting user.", BAD_REQUEST);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getUsers = async (req, res) => {
    const { user } = req?.body;
    const { q, sort, order } = req?.query;
    if (!checkAccess(req)) sendResponse(res, "Only admins can list user.", BAD_REQUEST);
    const { limit, offset } = paginationParams(req);
    try {

        const now = moment();
        let currentDay = now.format('ddd').toLowerCase();

        let match = { isDeleted: "n", };

        const sortObj = { firstName : 1 };

        if (sort === 'role') {
            if(!order) sendResponse(res, "Order is missing.", BAD_REQUEST);
            delete sortObj.firstName;
            sortObj['userRole.roleName'] = Number(order);
        } else if(sort) {
            if(!order) sendResponse(res, "Order is missing.", BAD_REQUEST);
            delete sortObj.firstName;
            sortObj[sort] = Number(order);
        }

        if (q) {
            match.$or = [
                { firstName: { $regex: q, $options: "ix" } },
                { lastName: { $regex: q, $options: "ix" } },
                { email: { $regex: q, $options: "ix" } },
                { phone: { $regex: q, $options: "ix" } }
            ]
        }
        if (isAdmin(req)) match.companyId = getMongooseObjectId(user.companyId);
        const users = await User.aggregate([
            {
                "$facet": {
                    data: [
                        {
                            $match: match
                        },
                        {
                            $lookup: {
                                from: 'userschedules',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'userSchedule'
                            }
                        },
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'roleId',
                                foreignField: '_id',
                                as: 'userRole'
                            }
                        },
                        { $unwind: "$userRole" },
                        { $sort: sortObj },
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
                                email: 1,
                                phone: 1,
                                doNotDisturbStatus: 1,
                                userSchedule: 1,
                                createdBy: 1,
                                timezone: 1,
                                roleId: 1,
                                role: "$userRole.roleName",
                                isDeleted: 1,
                                notifyVia: 1
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
        users[0].data.forEach((user) => {
            user.available = false;
            if (user.userSchedule.length > 0) {
                const userSchedule = user.userSchedule[0][currentDay];
                if (userSchedule.active === true) {
                    if (userSchedule.allDay === true) user.available = true;
                    else {
                        const availability = userSchedule.availability;
                        if (availability.length > 0) {
                            availability.forEach((a) => {
                                const serverTimeZone = moment().tz(user.timezone).format("HH:mm");
                                if (serverTimeZone >= a.startTime && serverTimeZone <= a.endTime) user.available = true;
                            });
                        }
                    }
                }
            }
            delete user.userSchedule;
        });

        const data = {
            list: users[0].data,
            totalCount: 0
        }

        if (users[0].pagination.length > 0) data.totalCount = users[0].pagination[0].total

        sendResponse(res, data, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getUserById = async (req, res) => {
    const userId = req?.params?.id;
    try {
        if (!userId && typeof userId === "undefined") sendResponse(res, "User id missing.", BAD_REQUEST);

        const user = await User.findOne(
            { _id: userId, isDeleted: "n" },
            "_id firstName lastName email phone notifyVia timezone language doNotDisturbStatus")
            .populate("roleId", "roleName")
            .populate("companyId", "companyName");
        if (!user) sendResponse(res, "User not found", NOT_FOUND);
        else sendResponse(res, user, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const list = async (req, res) => {
    const { user } = req?.body;
    try {
        const users = await User.find(
            { companyId: user.companyId, isDeleted: "n" },
            "_id firstName lastName");

        sendResponse(res, users, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const searchUser = async (req, res) => {
    const q = req?.params?.q;
    try {
        if (!q && typeof q === "undefined") sendResponse(res, "Search term missing.", BAD_REQUEST);

        const users = await User.find(
            {
                isDeleted: "n", $or: [
                    { firstName: { $regex: q, $options: "ix" } },
                    { lastName: { $regex: q, $options: "ix" } },
                    { email: { $regex: q, $options: "ix" } },
                    { phone: { $regex: q, $options: "ix" } }
                ]
            },
            "firstName lastName email phone timezone language doNotDisturbStatus")
            .populate("roleId", "roleName")
            .populate("companyId", "companyName");
        if (!users) sendResponse(res, "User not found", NOT_FOUND);
        else sendResponse(res, users, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email) sendResponse(res, "Email is missing.", BAD_REQUEST);
        else if (!password) sendResponse(res, "Password is missing.", BAD_REQUEST);
        else {
            const user = await User.findOne(
                { email, isDeleted: "n", verified: "y" },
                "email password companyId createdBy")
                .populate("roleId", "_id roleName")
                .populate({
                    path: "companyId",
                    populate: {
                        path: "defaultCountryId",
                        select: "_id"
                    },
                    select: "_id companyName userLoginType"
                });

            if (!user) sendResponse(res, "Invalid credentials.", BAD_REQUEST);
            else {
                if (user.companyId === null || [LOGIN_TYPE_BASIC, LOGIN_TYPE_BOTH].includes(user.companyId.userLoginType)) {
                    const isValidPassword = bcrypt.compareSync(password, user.password);
                    if (!isValidPassword) sendResponse(res, "Invalid credentials.", BAD_REQUEST);
                    else {
                        const payload = {
                            id: user._id,
                            roleId: user.roleId._id,
                            roleName: user.roleId.roleName,
                            companyAdminId: user.createdBy,
                        };
                        if (user.companyId != null) {
                            payload.companyId = user.companyId._id;
                            payload.countryId = user.companyId.defaultCountryId._id;
                        }

                        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "30d" });
                        const data = {
                            token,
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            roleName: user.roleId.roleName,
                        }

                        if (user.companyId != null) data.companyId = user.companyId._id;
                        sendResponse(res, data, OK);
                    }
                } else sendResponse(res, "You are not authorized.", OK);
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const setPassword = async (req, res) => {
    const { otp, password, confirmPassword, fp } = req.body;
    try {
        if (!otp) sendResponse(res, "Otp is missing.", BAD_REQUEST);
        else if (!password) sendResponse(res, "Password is missing.", BAD_REQUEST);
        else if (!confirmPassword) sendResponse(res, "Confirm password is missing.", BAD_REQUEST);
        else if (password != confirmPassword) sendResponse(res, "Passwords not matched.", BAD_REQUEST);
        else {
            const user = await User.findOne({ otp }, "_id email");
            if (!user) sendResponse(res, "User not found.", BAD_REQUEST);
            const saltRounds = 12;
            const hashPassword = bcrypt.hashSync(password, saltRounds);

            let match = {
                email: user.email,
                otp: otp,
                isDeleted: "n",
            }

            fp == "y" ? match.verified = "y" : match.verified = "n";

            const isUpdated = await User.findOneAndUpdate(
                match,
                {
                    password: hashPassword,
                    verified: "y",
                    updatedAt: Date.now()
                });
            if (isUpdated) sendResponse(res, "Password reset successfully.", OK);
            else sendResponse(res, "Error updating user.", INTERNAL_SERVER_ERROR);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) sendResponse(res, "Email is missing.", BAD_REQUEST);
        else {
            const userExist = await User.findOne({ email, isDeleted: "n", verified: "y" }, " _id ");
            if (!userExist) sendResponse(res, "User not found.", BAD_REQUEST);
            else {
                const otp = randomCode(6);
                await User.findOneAndUpdate(
                    {
                        email: email,
                        isDeleted: "n",
                        verified: "y"
                    },
                    {
                        otp: otp,
                        updatedAt: Date.now()
                    });

                sendResponse(res, "Email sent successfully. Please check your email.", OK);
                const appUrl = getDomain(req);
                const workerData = {
                    processName: "SEND-EMAIL",
                    data: {
                        to: `${email}`,
                        subject: "Supersell Forget Password",
                        html: `Hello! <br> Please reset your password by clicking the link below.
                        <a href="${appUrl}/setpassword?otp=${otp}&fp=y">Click this link to reset your password.</a>
                        If above link did't work you can copy and past below link into browser:
                        <b>${appUrl}/setpassword?otp=${otp}</b>`,
                    }
                };

                res.on('finish', async () => {
                    worker.postMessage(workerData);
                });
            }
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}


/**
 * SUPER-ADMIN/ADMIN ROUTES
 */

const loginAsClient = async (req, res) => {
    const {
        companyId
    } = req.body;
    try {
        if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
        const roleId = await getRoleByName(ROLE_ADMIN);
        const user = await User.findOne(
            { roleId, companyId, isDeleted: "n", verified: "y" },
            "email password companyId createdBy")
            .populate("roleId", "_id roleName")
            .populate({
                path: "companyId",
                populate: {
                    path: "defaultCountryId",
                    select: "_id"
                },
                select: "_id companyName userLoginType"
            });

        if (!user) sendResponse(res, "Admin not found.", BAD_REQUEST);
        else {
            const payload = {
                id: user._id,
                roleId: user.roleId._id,
                roleName: user.roleId.roleName,
                companyAdminId: user.createdBy,
                companyId: user.companyId._id,
                countryId: user.companyId.defaultCountryId._id
            };

            const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "30d" });
            const data = {
                token,
                id: user._id,
                name: user.name,
                email: user.email,
                roleName: user.roleId.roleName,
                loginAsClient : true,
                companyId: user.companyId._id,
            }
            sendResponse(res, data, OK);
        }
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    userLogin,
    setPassword,
    forgetPassword,
    searchUser,
    doNotDisturb,
    list,

    loginAsClient,
}


