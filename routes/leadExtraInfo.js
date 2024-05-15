const express = require("express");
const leadExtraInfoRouter = express.Router();
const auth = require("./middlewares/auth");
const leadExtraInfoController = require("./controllers/leadExtraInfo");

leadExtraInfoRouter.post("/", auth, leadExtraInfoController.addLeadExtraInfo);
leadExtraInfoRouter.delete("/:id", auth, leadExtraInfoController.deleteLeadExtraInfo);
leadExtraInfoRouter.get("/:id", auth, leadExtraInfoController.getLeadExtraInfo);

module.exports = leadExtraInfoRouter;