const httpStatus = require("http-status");
const TagsAndStages = require("../../models/tagAndStages");
const { checkAccess } = require("../../utils/common");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addTagAndStage = async (req, res) => {
  let {
    companyId,
    tags,
    stages
  } = req.body;

  if (!checkAccess(req)) sendResponse(res, "Only admins can add team.", BAD_REQUEST);
  try {
    if (!companyId) sendResponse(res, "Company id is missing.", BAD_REQUEST);
    if (!tags) sendResponse(res, "Tags are missing.", BAD_REQUEST);
    if (!stages) sendResponse(res, "Stages are missing.", BAD_REQUEST);

    const isDestroy = await TagsAndStages.deleteMany({ companyId });
    if(isDestroy) {
      const tagsAndStages = await TagsAndStages.create({
        companyId,
        tags,
        stages
    });
    sendResponse(res, tagsAndStages, OK);
    }

  } catch (err) {
    sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
  }
};

const list = async (req, res) => {
  const companyId = req?.params?.id;
  try {
      if (!companyId && typeof companyId === "undefined") sendResponse(res, "Company id missing");
      const tagsAndStages = await TagsAndStages.findOne(
          { companyId, isDeleted: "n" }, "-isDeleted -createdAt"
      ).populate("companyId", "companyName");
      
      sendResponse(res, tagsAndStages, OK);
  } catch (err) {
      sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  addTagAndStage,
  list,
}
