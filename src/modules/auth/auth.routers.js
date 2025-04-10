import express from "express";
import Controller from "./auth.controller.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";
import {
  registeryValidators,
  forgetPasswordVerifyCodeValidators,
  resetPasswordValidators,
  sendEmailValidators,
  activeAccountValidators,
  verifyLoginSuperValidators,
} from "./auth.validators.js";

const routers = express.Router();

// ****** Login ******** //
routers.post("/login", Controller.login);
// ****** Verify Login if super admin ******** //
routers.post(
  "/verif-account",
  verifyLoginSuperValidators,
  checkValidationErrors,
  Controller.verifyAccountAdmin
);

routers.post(
  "/register",
  registeryValidators,
  checkValidationErrors,
  Controller.registery
);

routers.post(
  "/active-account",
  activeAccountValidators,
  checkValidationErrors,
  Controller.activeAccount
);

routers.post(
  "/send-mail-active-account",
  sendEmailValidators,
  Controller.sendMailActiveAccount
);

routers.post(
  "/forgot-password",
  sendEmailValidators,
  checkValidationErrors,
  Controller.sendMailForgetPassword
);

routers.post(
  "/validation-code-forgot-password",
  forgetPasswordVerifyCodeValidators,
  checkValidationErrors,
  Controller.validationkeyForgetPassword
);

routers.patch(
  "/reset-password",
  /*resetPasswordValidators,
  checkValidationErrors,*/
  Controller.resetPassword
);

routers.patch(
  "/update-password",
  /*resetPasswordValidators,
  checkValidationErrors,*/
  Controller.updatePassword
);

routers.post("/check-token", Controller.checkToken);

export default routers;
