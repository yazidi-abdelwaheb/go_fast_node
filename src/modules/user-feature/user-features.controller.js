import {
  CustomError,
  errorCatch,
  getPaginatedData,
} from "../../shared/shared.exports.js";
import { Types } from "mongoose";
import UserFeature from "./user-feature.schema.js";

const model = UserFeature;

export default class UserFeatureController {
  static async getList(req, res) {
    /**
     * #swagger.summary = "get list of relation user feature"
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      const skip = (page - 1) * limit;
      const matchStage = {};

      if (search) {
        const regex = new RegExp(search, "i");
        matchStage.$or = [
          { "userId.first_name": regex },
          { "userId.last_name": regex },
          { "userId.email": regex },
          { "featureId.title": regex },
          { "featureId.code": regex },
          { "featureId.link": regex },
        ];
      }

      const aggregationPipeline = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $unwind: "$userId",
        },
        {
          $lookup: {
            from: "features",
            localField: "featureId",
            foreignField: "_id",
            as: "featureId",
          },
        },
        {
          $unwind: "$featureId",
        },
        {
          $match: matchStage,
        },
        {
          $project: {
            status: 1,
            create: 1,
            read: 1,
            update: 1,
            delete: 1,
            list: 1,
            defaultFeature: 1,
            createdAt: 1,
            updatedAt: 1,
            "userId.first_name": 1,
            "userId.last_name": 1,
            "userId.email": 1,
            "userId.avatar": 1,
            "featureId.code": 1,
            "featureId.title": 1,
            "featureId.icon": 1,
            "featureId.link": 1,
          },
        },
        {
          $facet: {
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const result = await UserFeature.aggregate(aggregationPipeline);

      const totalElement = result[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalElement / limit);
      const data = result[0].data;

      res.status(200).json({
        total: totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data,
      });
    } catch (error) {
      errorCatch(error, req, res);
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
                    userId : "userId"
                     userFeature :  [{
                      featureId: "featureId",
                      status : false,
                      create : false,
                      read : false,
                      update : false,
                      delete : false,
                      list :false,
                      defaultFeature : false
                      }
                    }]
                }
            }
        }
     */
    try {
      const { userId, userFeatures } = req.body;
      for (let userFeatute of userFeatures) {
        await new model({
          companyId: req.user.companyId,
          userCreation: req.user._id,
          userLastUpdate: req.user._id,
          userId: userId,
          featureId: userFeatute.featureId,
          status: userFeatute.status || false,
          create: userFeatute.create || false,
          read: userFeatute.read || false,
          update: userFeatute.update || false,
          delete: userFeatute.delete || false,
          list: userFeatute.list || false,
          defaultFeature: userFeatute.defaultFeature || false,
        }).save();
      }

      res
        .status(201)
        .json({ message: "Relation user features created successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary = "Read one by Id of relation  user features."
     */
    try {
      const id = req.params.id;
      const userFature = await model
        .findById(id)
        .populate("userId", "first_name last_name email avatar")
        .populate("featureId", "code title icon link")
        .populate("userCreation", "first_name last_name email avatar")
        .populate("userLastUpdate", "first_name last_name email avatar");
      res.status(200).json(userFature);
    } catch (error) {
      errorCatch(error, req, res);
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

      res
        .status(200)
        .json({ message: "relation  user features updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
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
        message: "relation user Fature deleted successfully. !",
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
