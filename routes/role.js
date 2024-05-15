const express = require("express");
const roleRouter = express.Router();
const auth = require('./middlewares/auth');
const roleController = require("./controllers/role");

roleRouter.post("/", auth, roleController.addRole);
roleRouter.get("/", auth, roleController.list);

module.exports = roleRouter;