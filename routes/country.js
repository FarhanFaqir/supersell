const express = require("express");
const auth = require('./middlewares/auth');
const countryRouter = express.Router();
const countryController = require("./controllers/country");

// countryRouter.post("/", countryController.addCountry);
countryRouter.get("/", auth, countryController.list);
countryRouter.get("/timezones", auth, countryController.getTimezones);

module.exports = countryRouter;