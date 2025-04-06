/**
 * end point exports all functions and classes and consts in this shared folder
 */

import {
  featureStatus,
  userState,
  UserTypeEnum,
  FeaturesTypeEnum,
  FeaturesStatusEnum,
  Orderstatus,
  features,
  actions,
  UserLanguagesEnum,
  UserStatusEnum,
} from "./enums/enums.js";

import {
  CustomError,
  errorCatch,
  getPaginatedData,
  generation_JWT_Token,
  generateUniqueUsername,
  generateUniqueCodeForOrders,
  upload
} from "./utils/utils.js";

import {
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
  customValidatorId,
  checkValidationErrors
} from "./utils/validators.utils.js";

import sendMail, {
  templateMails,
  subjects,
  contentMails
} from "./utils/mail.utils.js";

import {
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER
} from "./utils/const.js";

export {
  checkValidationErrors,
  featureStatus,
  userState,
  UserTypeEnum,
  FeaturesTypeEnum,
  FeaturesStatusEnum,
  CustomError,
  errorCatch,
  getPaginatedData,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
  customValidatorId,
  generation_JWT_Token,
  generateUniqueUsername,
  contentMails,
  templateMails,
  sendMail,
  subjects,
  Orderstatus,
  generateUniqueCodeForOrders,
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  upload,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER,
  features,
  actions,
  UserLanguagesEnum,
  UserStatusEnum
};
