import {
  CustomError,
  errorCatch,
  getPaginatedData,
} from "../../shared/shared.exports.js";
import { Types } from "mongoose";
import UserFeature from "./user-feature.schema.js";

const model = UserFeature;

export default class ProductsController {
  static async getList(req, res) {
    /**
     * #swagger.summary = "get list of relation user feature"
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      res.status(200).json({
        total: totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data,
      });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async createOne(req, res) {
    /**
     * #swagger.summary = "create new relation  user features."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     userFeature :  {
                      userId: "userId",
                      featureId: "featureId",
                      status : false,
                      create : false,
                      read : false,
                      update : false,
                      delete : false,
                      list :false,
                      defaultFeature : false
                      }
                    }
                }
            }
        }
     */
    try {
      const { userFeature } = req.body;
      await new model({
        companyId: req.user.companyId,
        userCreation: req.user._id,
        userId: userFeature.userId,
        featureId: userFeature.featureId,
        status: userFeature.status || false,
        create: userFeature.create || false,
        read: userFeature.read || false,
        update: userFeature.update || false,
        delete: userFeature.delete || false,
        list: userFeature.list || false,
        defaultFeature: userFeature.defaultFeature || false,
      }).save();
      res
        .status(201)
        .json({ message: "relation  user features created successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary = "Read one by Id of relation  user features."
     */
    try {
      const id = req.params.id;
      const userFature = await model.findById(id);
      res.status(200).json(userFature);
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * #swagger.summary = "update one of relation  user features."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     userFeature :  {
                      userId: "userId",
                      featureId: "featureId",
                      status : false,
                      create : false,
                      read : false,
                      update : false,
                      delete : false,
                      list :false,
                      defaultFeature : false
                      }
                    }
                }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { userFeature } = req.body;
      await model.updateOne(
        { _id },
        {
          companyId: req.user.companyId,
          userLastUpdate: req.user._id,
          userId: userFeature.userId,
          featureId: userFeature.featureId,
          status: userFeature.status || false,
          create: userFeature.create || false,
          read: userFeature.read || false,
          update: userFeature.update || false,
          delete: userFeature.delete || false,
          list: userFeature.list || false,
          defaultFeature: userFeature.defaultFeature || false,
        }
      );

      res.status(200).json({ message: "relation  user features updated successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one of relation user Fature."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });

      res.status(200).json({
        message:
          "relation user Fature deleted successfully. !",
      });
    } catch (error) {
      errorCatch(error, res);
    }
  }
}
