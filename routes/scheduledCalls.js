const express = require("express");
const scheduledCallRouter = express.Router();
const auth = require('./middlewares/auth');
const scheduledCallController = require("./controllers/scheduledCalls");

scheduledCallRouter.post("/", auth, scheduledCallController.addScheduledCall);
scheduledCallRouter.put("/:id", auth, scheduledCallController.updateScheduledCall);
scheduledCallRouter.get("/", auth, scheduledCallController.getScheduledCalls);
scheduledCallRouter.get("/:id", auth, scheduledCallController.getScheduledCallById);
scheduledCallRouter.get("/get/:leadId", auth, scheduledCallController.getScheduledCallByLeadId);

module.exports = scheduledCallRouter;