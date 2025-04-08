import {
  errorCatch,
  CustomError,
  getPaginatedData,
  featureStatus,
} from "../../shared/shared.exports.js";
import GroupFeature from "../groups/group-feature.schema.js";
import UserFeature from "../user-feature/user-feature.schema.js";
import Feature from "./features.schema.js";

export default class FeatureController {
  static async getList(req, res) {
    /**
     * #swagger.summary ="Get all Feature pagination ."
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";
      const filterType = req.query.filterType || "";
      const filterStatus = req.query.filterStatus || "";
      const filter = {};
      if (filterType) {
        filter.type = { $in: filterType.split(",") };
      }
      if (filterStatus) {
        filter.status = { $in: filterStatus.split(",") };
      }

      //const features = await Feature.find().populate("parentFeature")

      const { data, totalElement, totalPages } = await getPaginatedData(
        Feature,
        page,
        limit,
        search,
        ["code", "title", "subtitle"],
        filter,
        {
          from: "features",
          localField: "featuresIdParent",
          foreignField: "_id",
          as: "featuresIdParent",
        }
      );
      return res.status(200).json({
        total: totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data,
      });
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async getListParents(req, res) {
    /**
     * #swagger.summary ="Get list parents Feature ."
     */
    try {
      const Features = await Feature.find({
        type: { $in: ["group", "collapsable"] },
        status: featureStatus.active,
      });
      return res.status(200).json(Features);
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async all(req, res) {
    /**
     * #swagger.summary ="Get all features."
     */
    try {
      const Features = await Feature.find({
        status: featureStatus.active,
      });
      return res.status(200).json(Features);
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async getSingleFeatureByLink(req, res) {
    try {
      const defaultFeature = await Feature.aggregate([
        {
          $lookup: {
            from: "features",
            localField: "featuresIdParent",
            foreignField: "_id",
            as: "featuresIdParent",
          },
        },
        {
          $unwind: {
            path: "$featuresIdParent",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: { link: req.body.link, status: featureStatus.active },
        },
      ]);
      let defaultFeaturesId = [];
      if (!defaultFeature || (defaultFeature && !defaultFeature.length)) {
        defaultFeaturesId = await UserFeature.aggregate([
          {
            $lookup: {
              from: "features",
              localField: "featureId",
              foreignField: "_id",
              as: "featureId",
            },
          },
          {
            $unwind: { path: "$featureId", preserveNullAndEmptyArrays: true },
          },
          {
            $match: {
              "featureId.link": { $exists: true },
              "featureId.status": featureStatus.active,
              status: true,
            },
          },
        ]);
        if (!defaultFeaturesId || !defaultFeaturesId.length) {
          defaultFeaturesId = await GroupFeature.aggregate([
            {
              $lookup: {
                from: "features",
                localField: "featureId",
                foreignField: "_id",
                as: "featureId",
              },
            },
            {
              $unwind: {
                path: "$featureId",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                "featureId.link": { $exists: true },
                "featureId.status": featureStatus.active,
                status: true,
              },
            },
          ]);
        }
      }
      // eslint-disable-next-line no-nested-ternary
      return res
        .status(200)
        .json(
          defaultFeature && defaultFeature.length
            ? defaultFeature
            : defaultFeaturesId && defaultFeaturesId.length
            ? defaultFeaturesId[0].featuresId
            : []
        );
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async createOne(req, res) {
    /**
     * #swagger.summary ="Create new Feature ."
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     feature :  {
                      code: "getting_started",
                      title: "Getting Started",
                      type: "basic",
                      subtitle: "getting started",
                      icon: "x-icon",  
                      link :"/",
                      order:1,
                      status: "active",  
                      parentFeature: "FeatureId"
                      }
                    }
                }
            }
        }
     */
    try {
      const { feature } = req.body;
      await new Feature(feature).save();
      return res.status(201).json({ message: "Feature created successfully" });
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary ="Get one Feature ."
     */
    try {
      const { id } = req.params;
      const document = await Feature.findById(id).populate("featuresIdParent");

      return res.status(200).json(document);
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async updateOne(req, res) {
    /**
     * #swagger.summary ="Update one Feature ."
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     feature :  {
                      code: "getting_started",
                      title: "Getting Started",
                      type: "basic",
                      subtitle: "getting started",
                      icon: "x-icon",  
                      link :"/",
                      order:1,
                      status: "active",  
                      parentFeature: "FeatureId"
                      }
                    }
                }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { feature } = req.body;
      await Feature.updateOne({ _id }, feature);
      return res.status(201).json({ message: "Feature updated successfully." });
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one Feature ."
     */
    try {
      const _id = req.params.id;
      await Feature.deleteOne({ _id });

      return res.status(204).json({ message: "Feature updated successfully." });
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }

  static async getListParents(req, res) {
    try {
      const Features = await Feature.find({
        type: { $in: ["group", "collapsable"] },
        status: featureStatus.active,
      });
      return res.status(200).json(Features);
    } catch (e) {
      
      errorCatch(e, req , res);
    }
  }
}
