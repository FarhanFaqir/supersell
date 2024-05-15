const express = require("express");
const userScheduleRouter = express.Router();
const auth = require('./middlewares/auth');
const userScheduleController = require("./controllers/userSchedule");

userScheduleRouter.post("/", auth, userScheduleController.addUserSchedule);
// userScheduleRouter.put("/:id", auth, userScheduleController.updateUserSchedule);
userScheduleRouter.get("/:id", auth, userScheduleController.getUserSchedule);
// userScheduleRouter.delete("/:id", auth, userScheduleController.deleteUserSchedule);
// userScheduleRouter.get("/", auth, userScheduleController.getUserSchedules);
// userScheduleRouter.get("/:id", auth, userScheduleController.getUserScheduleById);

module.exports = userScheduleRouter;