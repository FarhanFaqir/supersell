const express = require("express");
const twilioNumberSettingRouter = express.Router();
const auth = require("./middlewares/auth");
const twilioNumberSettingController = require("./controllers/twilioNumberSetting");
const { uploadAudio } = require("./middlewares/upload");

twilioNumberSettingRouter.post("/", uploadAudio, auth, twilioNumberSettingController.addTwilioNumberSetting);
twilioNumberSettingRouter.get("/:id", auth, twilioNumberSettingController.getTwilioNumberSettingById);

module.exports = twilioNumberSettingRouter;