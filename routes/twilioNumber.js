const express = require("express");
const twilioNumberRouter = express.Router();
const auth = require("./middlewares/auth");
const twilioNumberController = require("./controllers/twilioNumber");

twilioNumberRouter.post("/", auth, twilioNumberController.addTwilioNumber);
twilioNumberRouter.put("/:id", auth, twilioNumberController.updateTwilioNumber);
twilioNumberRouter.delete("/:id", auth, twilioNumberController.deleteTwilioNumber);
twilioNumberRouter.get("/", auth, twilioNumberController.getTwilioNumbers);
twilioNumberRouter.get("/:id", auth, twilioNumberController.getTwilioNumberById);
twilioNumberRouter.get("/list/numbers", auth, twilioNumberController.list);

module.exports = twilioNumberRouter;