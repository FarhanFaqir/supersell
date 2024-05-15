const express = require("express");
const auth = require('./middlewares/auth');
const companyFieldSettingRouter = express.Router();
const companyFieldSettingController = require("./controllers/companyFieldSetting");

companyFieldSettingRouter.post("/", auth, companyFieldSettingController.addCompanyFieldSetting);
companyFieldSettingRouter.get("/:id", auth, companyFieldSettingController.getCompanyFieldSettings);

module.exports = companyFieldSettingRouter;