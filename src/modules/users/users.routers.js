import controller from "./users.controller.js";
import { Router } from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
  updateMyAccountValidation,
  updateMyLanguageValidation,
  updateMyStatusValidation,
} from "./users.validator.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";

// ****** Define routes ****** //
const routers = Router();

routers.get("/", controller.getList);
// ****** get info user connected ******** //
routers.get("/me", controller.me);

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
// ****** update account user connected ******** //
routers.put(
  "/update-my-account",
  updateMyAccountValidation,
  checkValidationErrors,
  controller.updateMyAccount
);

routers.patch(
  "/language",
  updateMyLanguageValidation,
  checkValidationErrors,
  controller.updateMyAccount
);

routers.patch(
  "/status",
  updateMyStatusValidation,
  checkValidationErrors,
  controller.updateMyStatus
);

export default routers;
