const express = require("express");
const teamUserRouter = express.Router();
const auth = require('./middlewares/auth');
const teamUserController = require("./controllers/teamUser");

teamUserRouter.post("/", auth, teamUserController.addTeamUser);
// teamUserRouter.put("/:id", auth, teamUserController.updateTeamUser);
// teamUserRouter.delete("/:id", auth, teamUserController.deleteTeamUser);
// teamUserRouter.get("/", auth, teamUserController.getTeamUsers);
teamUserRouter.get("/:id", auth, teamUserController.getTeamUsers);

module.exports = teamUserRouter;