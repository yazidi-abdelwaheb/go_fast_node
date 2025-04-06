import jwt from "jsonwebtoken";
import Users from "../modules/users/users.shema.js";
import {
  actions,
  CustomError,
  errorCatch,
  features,
  featureStatus,
  UserTypeEnum,
} from "../shared/shared.exports.js";
import Feature from "../modules/features/features.shema.js";
import UserFeature from "../modules/user-feature/user-feature.shema.js";
import GroupFeature from "../modules/groups/group-feature.shema.js";

/**********************  TOKEN VALIDATION MIDLWARES  **********************/

/**
 * authorization
 * @param {Request} req This Fetch API interface represents a resource request.
 * @param {Response} res This Fetch API interface represents the response to a request
 * @param {*} next next action to execute
 */
export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new CustomError("Bad token", 401);
    }

    const tokenSplit = authHeader.split(" ");
    if (tokenSplit.length !== 2 || tokenSplit[0] !== "Bearer") {
      throw new CustomError("Bad token format", 401);
    }

    const token = tokenSplit[1];

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new CustomError("401 Unauthorized", 401);
    }
    
    const userData = await Users.findOne({ _id: user._id } , { isActive: 1 , lang : 1});

    if (!userData || !userData.isActive) {
      throw new CustomError(
        "Your account is inactive. Please activate your account and try again later or contact your administrator.",
        403
      );
    }

    req.user = user;
    req.user.lang = userData.lang;
    //console.log(req.user);
    
    next();
  } catch (error) {
    errorCatch(error, res);
  }
};

export const isAuthorized = (features_) => async (req, res, next) => {
  try {
    if (!features_ || (features_ && features_.length === 0)) {
      throw new CustomError("bad features", 500);
    }

    for (const feature of features_) {
      const { code } = feature;
      const actionsFeature = feature.actions;
      if (!code || !Object.values(features).includes(code)) {
        throw new CustomError(`Bad code ${code}`, 500);
      }

      if (!actionsFeature || !actionsFeature.length) {
        throw new CustomError("bad actions", 500);
      }

      for (const actionFeature of actionsFeature) {
        if (!Object.values(actions).includes(actionFeature)) {
          throw new CustomError(`Bad action ${actionFeature} of ${code}`, 500);
        }
      }
    }
    const { type } = req.user;
    if (type === UserTypeEnum.super) {
      return next();
    }
    for (const feature of features_) {
      const { code } = feature;
      const actionsFeature = feature.actions;
      const featureFind = await Feature.findOne({ code });
      if (featureFind && featureFind.status === featureStatus.active) {
        const { companyId } = req.user;
        let userFeatureFind = await UserFeature.findOne({
          userId: req.user._id,
          featureId: featureFind._id,
          companyId,
        });
        if (!userFeatureFind) {
          const { groupId } = req.user;
          userFeatureFind = await GroupFeature.findOne({
            groupId,
            featureId: featureFind._id,
            companyId,
          });
        }
        if (userFeatureFind && userFeatureFind.status) {
          for (const actionFeature of actionsFeature) {
            if (userFeatureFind[actionFeature]) {
              return next();
            }
          }
        }
      }
    }
    throw new CustomError("Forbidden access", 403);
  } catch (e) {
    return errorCatch(e, res);
  }
};

/********************** TYPE VALIDATION MIDDLEWARES **********************/

/**
 * function to verify user type
 * @param {Request} req This Fetch API interface represents a resource request.
 * @param {Response} res This Fetch API interface represents the response to a request
 * @param {function} next next action to execute
 * @param {string} type user type
 * @returns next action if `req.user.type === type` else return error to client with status code `401`
 */
const verifyType = (req, res, next, type) => {
  try {
    if (req.user.type === type) {
      return next();
    }
    throw new CustomError("403 Forbidden access", 403);
  } catch (error) {
    errorCatch(error, res);
  }
};

export const isSuper = (req, res, next) => verifyType(req, res, next, "super");

export const isAdmin = (req, res, next) => verifyType(req, res, next, "admin");

/************************************************/

export const isActive = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findOne({ _id: userId }, { isActive: 1 });
    if (user.isActive) {
      return next();
    }

    throw new CustomError(
      "Your account is inactive. Please activate your account and try again later or contact your administrator.",
      403
    );
  } catch (error) {
    errorCatch(error, res);
  }
};
