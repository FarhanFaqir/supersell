const mongoose = require("mongoose");
const Role = require("../models/role");
const { ROLE_ADMIN, ROLE_SUPER_ADMIN } = require("./constant");

const checkPasswordStrength = (password) => {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    ? true
    : false;
};

const paginationParams = (req) => {
  let offset = req.query.offset ? parseInt(req.query.offset) : 0;
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  return {
    offset,
    limit
  }
}

const getParamValue = (req, paramName) => {
  return req?.query[paramName] !== undefined ? req?.query[paramName] : null
}

const getMongooseObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
}

const checkCaseInsensitive = (name) => {
  return new RegExp(`^${name}$`, "i");
}

const randomCode = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const isSuperAdmin = (req) => {
  return req?.body?.user?.roleName == ROLE_SUPER_ADMIN
  ? true
  : false
}

const isAdmin = (req) => {
  return req?.body?.user?.roleName == ROLE_ADMIN
  ? true
  : false
}

const checkAccess = (req) => {
  return isSuperAdmin(req) || isAdmin(req)
  ? true
  : false
}

const getDomain = (httpRequest = null) => {
  if (httpRequest) {
    if (httpRequest.hostname === "localhost") {
      return `${httpRequest.protocol}://${httpRequest.hostname}:5173`;
    } else {
      return `${httpRequest.protocol}://52.50.214.101`;
    }
  } else return `http://52.50.214.101`;
};

const getRoleByName = async (roleName) => {
  const role = await Role.findOne({ roleName, isDeleted : "n"});
  return role._id;
}

module.exports = {
  checkPasswordStrength,
  paginationParams,
  getParamValue,
  getMongooseObjectId,
  checkCaseInsensitive,
  randomCode,
  isSuperAdmin,
  isAdmin,
  checkAccess,
  getDomain,
  getRoleByName
}