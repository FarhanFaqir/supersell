const express = require("express");
const leadHistoryRouter = express.Router();
const auth = require('./middlewares/auth');
const leadHistoryController = require("./controllers/leadHistory");

leadHistoryRouter.post("/", auth, leadHistoryController.addLeadHistory);
leadHistoryRouter.get("/:id", auth, leadHistoryController.list);

module.exports = leadHistoryRouter;