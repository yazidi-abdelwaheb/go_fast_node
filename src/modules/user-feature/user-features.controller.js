import {
  CustomError,
  errorCatch,
  FeaturesTypeEnum,
  getPaginatedData,
} from "../../shared/shared.exports.js";
import { Types } from "mongoose";
import UserFeature from "./user-feature.schema.js";
import GroupFeature from "../groups/group-feature.schema.js";
import Features from "../features/features.schema.js";

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
      const matchStage = { "feature.type": FeaturesTypeEnum.basic };

      if (search) {
        const regex = new RegExp(search, "i");
        matchStage.$or = [
          { "user.first_name": regex },
          { "user.last_name": regex },
          { "user.email": regex },
          { "feature.title": regex },
          { "feature.code": regex },
          { "feature.link": regex },
        ];
      }

      const aggregationPipeline = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "features",
            localField: "featureId",
            foreignField: "_id",
            as: "feature",
          },
        },
        { $unwind: "$feature" },
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: "$user._id",
            user: { $first: "$user" },
            userFeatures: {
              $push: {
                _id: "$feature._id",
                code: "$feature.code",
                title: "$feature.title",
                icon: "$feature.icon",
                link: "$feature.link",
                status: "$status",
              },
            },
          },
        },
        {
          $project: {
            _id: "$user._id",
            first_name: "$user.first_name",
            last_name: "$user.last_name",
            email: "$user.email",
            avatar: "$user.avatar",
            userFeatures: "$userFeatures",
          },
        },
        {
          $facet: {
            data: [
              { $sort: { creatAt: -1 } },
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
                      "user" : {
                        "_id": "userId"
                      },
                      "group" : [
                          {
                            "featureId":{
                              "_id":"featureId"
                            },
                            "status": false,
                            "create": false,
                            "read": false,
                            "update": false,
                            "delete": false,
                            "list": false,
                            "defaultFeature": false
                          }
                      ]
                    }
                }
            }
        }
     */
    try {
      const { user, group } = req.body;

      // create new user-features
      for await (let userFeatute of group) {
        const featureId = userFeatute.featureId._id;
        if (await model.findOne({ featureId, userId: user._id })) {
          await model.deleteOne({ featureId, userId: user._id });
        }
        const parentFeature = await Features.findById(featureId);
        await new model({
          companyId: req.user.companyId,
          userId: user._id,
          featureId: parentFeature.featuresIdParent,
          status: true,
        }).save();

        await new model({
          companyId: req.user.companyId,
          userId: user._id,
          featureId: featureId,
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
     * #swagger.summary = "Read one by userId and return list of features."
     */
    try {
      const { userId } = req.params;

      const userFeatures = await model
        .find({ userId })
        .populate("userId", "_id first_name last_name email avatar")
        .populate("featureId", "_id code title icon link type");

      if (userFeatures.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or has no features." });
      }

      const data = {
        _id: userFeatures[0].userId._id,
        first_name: userFeatures[0].userId.first_name,
        last_name: userFeatures[0].userId.last_name,
        email: userFeatures[0].userId.email,
        avatar: userFeatures[0].userId.avatar,
        userFeaturesFull: userFeatures
          .filter((uf) => uf.featureId.type === FeaturesTypeEnum.basic)
          .map((uf) => ({
            _id: uf.featureId._id,
            code: uf.featureId.code,
            title: uf.featureId.title,
            icon: uf.featureId.icon,
            link: uf.featureId.link,
            create: uf.create,
            read: uf.read,
            update: uf.update,
            delete: uf.delete,
            list: uf.list,
            status: uf.status,
            defaultFeature: uf.defaultFeature,
          })),
      };

      res.status(200).json(data);
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
                     "user" : {
                        "_id": "userId"
                      },
                      "group" : [
                          {
                            "featureId":{
                              "_id":"featureId"
                            },
                            "status": false,
                            "create": false,
                            "read": false,
                            "update": false,
                            "delete": false,
                            "list": false,
                            "defaultFeature": false
                          }
                      ]
                    }
                }
            }
        }
     */
    try {
      const { userFeatures } = req.body;
      console.log(userFeatures);
      
      const userId = req.params.userId
      await model.deleteMany({ userId:userId });

      // create new user-features
      for await (let userFeatute of userFeatures) {
        const featureId = userFeatute._id;
        if (await model.findOne({ featureId, userId: userId })) {
          await model.deleteOne({ featureId, userId: userId });
        }
        const parentFeature = await Features.findById(featureId);
        await new model({
          companyId: req.user.companyId,
          userId: userId,
          featureId: parentFeature.featuresIdParent,
          status: true,
        }).save();

        await new model({
          companyId: req.user.companyId,
          userId: userId,
          featureId: userFeatute._id,
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
        .status(200)
        .json({ message: "relation  user features updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one of relation user Features."
     */
    try {
      const userId = req.params.userId;
      await model.deleteMany({ userId });

      res.status(200).json({
        message: "relation user Features deleted successfully. !",
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
