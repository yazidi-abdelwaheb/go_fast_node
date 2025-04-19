import controller from "./clients.controller.js";
import { Router } from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
  updateMyAccountValidation,
} from "./clients.validator.js";
import {
  checkValidationErrors,
  featuresCodeEnum,
  featuresActionsEnum,
} from "../../shared/shared.exports.js";
import { isAuthorized } from "../../middlewares/auth.middlewares.js";

// ****** Define routes ****** //
const routers = Router();

// ****** get Lsit users with pagination ****** //
routers.get(
  "/",
  /*isAuthorized([
    {
      code: featuresCodeEnum.users,
      actions: [featuresActionsEnum.list],
    },
  ]),*/
  controller.getList
);
// ****** get all client ****** //
routers.get("/all", controller.getAll);
// ****** get info client connected ******** //
routers.get("/me", controller.me);

routers.get(
  "/:id",
  /*isAuthorized([
    {
      code: featuresCodeEnum.users,
      actions: [featuresActionsEnum.read],
    },
  ]),*/
  readOneValidation,
  checkValidationErrors,
  controller.readOne
);

routers.post(
  "/",
  /*isAuthorized([
    {
      code: featuresCodeEnum.users,
      actions: [featuresActionsEnum.create],
    },
  ]),*/
  /*createOneValidation,*/
  checkValidationErrors,
  controller.createOne
);

routers.put(
  "/:id",
  /*isAuthorized([
    {
      code: featuresCodeEnum.users,
      actions: [featuresActionsEnum.update],
    },
  ]),*/

  updateOneValidation,
  checkValidationErrors,
  controller.updateOne
);

routers.delete(
  "/:id",
  /*isAuthorized([
    {
      code: featuresCodeEnum.clinet,
      actions: [featuresActionsEnum.delete],
    },
  ]),*/
  deleteOneValidation,
  checkValidationErrors,
  controller.deleteOne
);

export default routers;
