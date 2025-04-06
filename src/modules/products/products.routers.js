import controller from "./products.controller.js";
import { Router } from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
  productIdValidator,
} from "./products.validator.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";
import OrdersController from "../orders/orders.controller.js";

// ****** Define routes ****** //
const routers = Router();

// ****** get all products of user ****** //
routers.get("/user/:userId",  controller.getList);
// ****** get all products ****** //
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

// ************** get all Orders of product  ************* //
routers.get(
  "/:id/Orders",
  productIdValidator,
  checkValidationErrors,
  OrdersController.getList
);

export default routers;
