const express = require("express");
const teamRouter = express.Router();
const auth = require('./middlewares/auth');
const teamController = require("./controllers/team");

teamRouter.post("/", auth, teamController.addTeam);
teamRouter.put("/:id", auth, teamController.updateTeam);
teamRouter.delete("/:id", auth, teamController.deleteTeam);
teamRouter.get("/", auth, teamController.getTeams);
teamRouter.get("/:id", auth, teamController.getTeamById);
teamRouter.put("/donotdisturb/:id", auth, teamController.doNotDisturb);
teamRouter.get("/routing/setting/list", auth, teamController.getLeadRoutingSettingList);
teamRouter.get("/list/all", auth, teamController.list);

module.exports = teamRouter;