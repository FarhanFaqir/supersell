const express = require("express");
const userRouter = express.Router();
const auth = require('./../middlewares/auth');
const userController = require("./../controllers/user");

userRouter.post("/login-as-client", auth, userController.loginAsClient);

module.exports = userRouter;