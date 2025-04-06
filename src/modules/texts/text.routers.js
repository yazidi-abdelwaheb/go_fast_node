import controller from "./text.controller.js";
import {Router} from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
} from "./text.validator.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";

// ****** Define routes ****** //
const routers = Router();

routers.get("/", controller.getTexts);

routers.get("/list",  controller.getList);

routers.get(
  "/:id",
  readOneValidation,
  checkValidationErrors,
  controller.readOne
);

routers.post(
  "/",
  createOneValidation,
  checkValidationErrors,
  controller.createOne
);

routers.put(
  "/:id",
  updateOneValidation,
  checkValidationErrors,
  controller.updateOne
);

routers.delete(
  "/:id",
  deleteOneValidation,
  checkValidationErrors,
  controller.deleteOne
);

export default routers;
