import ms from "ms";

/**
 * 10 minutes
 */
const CODE_EXPIRE_IN_FORGET_PASSWORD = ms("10m");
/**
 * 20 minutes
 */
const CODE_EXPIRE_IN_ACTIVATE_ACCOUNT = ms("20m");
/**
 * 5 minutes
 */
const CODE_EXPIRE_IN_LOGIN_SUPER = ms("5m");
/**
 * 1 week
 */
const TOKEN_EXPIRE_IN_USERS = ms("1w");
/**
 * 10 hours
 */
const TOKEN_EXPIRE_IN_SUPER = ms("10h");

/**
 * 10 attempts
 */
const ATTEMPTS_OF_CODE_VALIDATION = 10

/**
 * 3 attempts
 */
const ATTEMPTS_OF_CODE_VALIDATION_SUPER = 3

export {
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER
};
