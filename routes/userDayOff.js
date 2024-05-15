const express = require("express");
const userDayOffRouter = express.Router();
const auth = require('./middlewares/auth');
const userDayOffController = require("./controllers/userDayOff");

userDayOffRouter.post("/", auth, userDayOffController.addUserDayOff);
userDayOffRouter.delete("/:id", auth, userDayOffController.deleteUserDayOff);
userDayOffRouter.get("/", auth, userDayOffController.getUserDayOffs);

module.exports = userDayOffRouter;