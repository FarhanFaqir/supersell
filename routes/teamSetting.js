const express = require("express");
const teamSettingRouter = express.Router();
const auth = require("./middlewares/auth");
const teamSettingController = require("./controllers/teamSetting");

teamSettingRouter.post("/", auth, teamSettingController.addTeamSetting);
teamSettingRouter.get("/:id", auth, teamSettingController.getTeamSetting);

module.exports = teamSettingRouter;