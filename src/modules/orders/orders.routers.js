import controller from "./orders.controller.js";
import { Router } from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
} from "./orders.validator.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";

// ****** Define routes ****** //
const routers = Router();

// ****** get all Orders of user ****** //
routers.get("/user/:userId", controller.getList);
// ****** get all Orders ****** //
routers.get("/", controller.getList);

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
