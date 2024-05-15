const express = require("express");
const teamScheduleRouter = express.Router();
const auth = require('./middlewares/auth');
const teamScheduleController = require("./controllers/teamSchedule");

teamScheduleRouter.post("/", auth, teamScheduleController.addTeamSchedule);
// teamScheduleRouter.put("/:id", auth, teamScheduleController.updateTeamSchedule);
teamScheduleRouter.get("/:id", auth, teamScheduleController.getTeamSchedule);

module.exports = teamScheduleRouter;