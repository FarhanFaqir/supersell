const express = require("express");
const companyRouter = express.Router();
const auth = require('./middlewares/auth');
const { uploadImage } = require('./middlewares/upload');
const companyController = require("./controllers/company");

companyRouter.post("/", uploadImage, auth, companyController.addCompany);
companyRouter.put("/:id",uploadImage, auth, companyController.updateCompany);
companyRouter.put("/setting/:id", auth, companyController.updateCompanySettings);
companyRouter.put("/status/:id", auth, companyController.updateCompanyStatus);
companyRouter.delete("/:id", auth, companyController.deleteCompany);
companyRouter.get("/", auth, companyController.getCompanies);
companyRouter.get("/:id", auth, companyController.getCompanyById);
companyRouter.get("/permission/:id", auth, companyController.getPermissions);
companyRouter.get("/routing/setting/list", auth, companyController.getRoutingSettingList);

module.exports = companyRouter;