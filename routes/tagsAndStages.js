const express = require("express");
const auth = require('./middlewares/auth');
const tagsAndStatusRouter = express.Router();
const tagsAndStatusController = require("./controllers/tagsAndStages");

tagsAndStatusRouter.post("/", auth, tagsAndStatusController.addTagAndStage);
tagsAndStatusRouter.get("/:id", auth, tagsAndStatusController.list);

module.exports = tagsAndStatusRouter;