const express = require("express");
const leadRouter = express.Router();
const auth = require('./middlewares/auth');
const leadController = require("./controllers/lead");

leadRouter.post("/", auth, leadController.addLead);
leadRouter.post("/tags/:id", auth, leadController.addLeadTags);
leadRouter.put("/stage", auth, leadController.updateLeadStage);
leadRouter.put("/:id", auth, leadController.updateLead);
leadRouter.delete("/:id", auth, leadController.deleteLead);
leadRouter.get("/", auth, leadController.getLeads);
leadRouter.get("/:id", auth, leadController.getLeadById);
leadRouter.get("/download/csv", auth, leadController.downloadLeads);
leadRouter.get("/routing/setting/list", auth, leadController.getLeadRoutingSettingList);
leadRouter.get("/lead-owner/routing/setting/list", auth, leadController.getLeadOwnerRoutingSettingList);

module.exports = leadRouter;