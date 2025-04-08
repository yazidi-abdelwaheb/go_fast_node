/**
 * end point exports all functions and classes and consts in this shared folder
 */

export  {
  featureStatus,
  userState,
  UserTypeEnum,
  FeaturesTypeEnum,
  FeaturesStatusEnum,
  Orderstatus,
  featuresCodeEnum,
  featuresActionsEnum,
  UserLanguagesEnum,
  UserStatusEnum,
} from "./enums/enums.js";

export {
  CustomError,
  errorCatch,
  getPaginatedData,
  generation_JWT_Token,
  generateUniqueUsername,
  generateUniqueCodeForOrders,
  upload
} from "./utils/utils.js";

export {
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
  customValidatorId,
  checkValidationErrors
} from "./utils/validators.utils.js";

export  {
  sendMail,
  templateMails,
  subjects,
  contentMails
} from "./utils/mail.utils.js";

export {
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER
} from "./utils/const.js";


