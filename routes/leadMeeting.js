const express = require("express");
const leadMeetingRouter = express.Router();
const auth = require("./middlewares/auth");
const leadMeetingController = require("./controllers/leadMeeting");

leadMeetingRouter.post("/", auth, leadMeetingController.addLeadMeeting);
leadMeetingRouter.put("/:id", auth, leadMeetingController.updateLeadMeeting);
leadMeetingRouter.delete("/:id", auth, leadMeetingController.deleteLeadMeeting);
leadMeetingRouter.get("/", auth, leadMeetingController.getLeadMeetings);
leadMeetingRouter.get("/get/:leadId", auth, leadMeetingController.getLeadMeetingByLeadId);
leadMeetingRouter.get("/:id", auth, leadMeetingController.getLeadMeetingById);
leadMeetingRouter.get("/download/csv", auth, leadMeetingController.downloadLeadMeetings);

module.exports = leadMeetingRouter;