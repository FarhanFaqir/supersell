const express = require("express");
const meetingRouter = express.Router();
const auth = require("./middlewares/auth");
const meetingController = require("./controllers/meeting");

meetingRouter.post("/", auth, meetingController.addMeeting);
meetingRouter.put("/:id", auth, meetingController.updateMeeting);
meetingRouter.delete("/:id", auth, meetingController.deleteMeeting);
meetingRouter.get("/", auth, meetingController.getMeetings);

module.exports = meetingRouter;