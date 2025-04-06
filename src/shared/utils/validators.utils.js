import { validationResult } from "express-validator";


/********************** ERROR VALIDATION MIDDLEWARES  **********************/
/**
 *
 * @param {Request} req This Fetch API interface represents a resource request.
 * @param {Response} res This Fetch API interface represents the response to a request
 * @param {*} next next action to execute
 * @returns
 */
export const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

/************** Custom Express Validator ******************/
import { Types } from "mongoose";
/**
 * custom validator unique value for insert
 * @param {shema} model
 * @param {string} field
 * @param {object} query
 * @returns {Promise<boolean|Error>}
 */
export const customValidatorUniqueValueForInsert = async (
  model,
  field,
  query
) => {
  const data = await model.findOne(query);
  if (data) {
    throw new Error(`the ${field} already in use.`);
  }
  return true;
};

/**
 * custom validator unique value for update
 * @param {shema} model
 * @param {string} field
 * @param {object} query
 * @param {string} reqId
 * @returns {Promise<boolean|Error>}
 */
export const customValidatorUniqueValueForUpdate = async (
  model,
  field,
  query,
  reqId
) => {
  const data = await model.findOne(query);
  if (data && data._id != reqId) {
    throw new Error(`the ${field} already in use.`);
  }
  return true;
};

/**
 * custom validator Id
 * @param {shema} model shema object
 * @param {string} id id of the model
 * @param {string} shema_name shema name or description of the model
 * @returns {Promise<boolean|Error>}
 */
export const customValidatorId = async (model, id, shema_name) => {
  const data = await model.findOne({
    _id: new Types.ObjectId(id),
  });
  if (!data) {
    throw new Error(`${shema_name} does not exist`);
  }
  return true;
};
