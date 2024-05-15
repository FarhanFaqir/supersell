const express = require("express");
const holidayRouter = express.Router();
const auth = require('./middlewares/auth');
const holidayController = require("./controllers/holiday");

holidayRouter.post("/", auth, holidayController.addHoliday);
holidayRouter.put("/:id", auth, holidayController.updateHoliday);
holidayRouter.put("/donotdisturb/:id", auth, holidayController.updateHolidayDoNotDisturbStatus);
holidayRouter.delete("/:id", auth, holidayController.deleteHoliday);
holidayRouter.get("/", auth, holidayController.getHolidays);
holidayRouter.get("/:id", auth, holidayController.getHolidayById);

module.exports = holidayRouter;