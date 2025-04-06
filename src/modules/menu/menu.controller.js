import { Types } from "mongoose";
import {
  actions,
  featureStatus,
  errorCatch,
} from "../../shared/shared.exports.js";
import Features from "../features/features.schema.js";
import UserFeature from "../user-feature/user-feature.schema.js";
import GroupFeature from "../groups/group-feature.schema.js";

export default class MenuController {
  static async getMenu(req, res) {
    try {
      let features = [];
      if (req.user.type === "super") {
        const featureList = await Features.aggregate([
          { $match: { status: featureStatus.active } },
          { $sort: { order: 1 } },
        ]);
        features = featureList.map((feature) => ({
          _id: feature._id,
          id: feature._id,
          subtitle: feature.subtitle,
          link: feature.link,
          icon: feature.icon,
          featuresIdParent: feature.featuresIdParent,
          code: feature.code,
          title: feature.title,
          create: true,
          delete: true,
          update: true,
          read: true,
          type: feature.type,
          children: [],
        }));
      } else {
        const filterUser = {
          userId: new Types.ObjectId(req.user.id),
        };
        const usersFeatures = await UserFeature.aggregate([
          { $match: filterUser },
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
          { $match: { "featureId.status": featureStatus.active } },
          { $sort: { "featureId.order": 1 } },
        ]);

        let groupsFeatures = [];
        if (req.user.groupId) {
          const filterGroup = {
            groupId: new Types.ObjectId(req.user.groupId),
          };
          groupsFeatures = await GroupFeature.aggregate([
            { $match: filterGroup },
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
            { $match: { "featureId.status": featureStatus.active } },
            { $sort: { "featureId.order": 1 } },
          ]);
        }

        const usersFeaturesData = usersFeatures.map((feature) => ({
          _id: feature.featuresId._id,
          id: feature.featuresId._id,
          subtitle: feature.featuresId.subtitle,
          link: feature.featuresId.link,
          icon: feature.featuresId.icon,
          featuresIdParent: feature.featuresId.featuresIdParent,
          code: feature.featuresId.code,
          title: feature.featuresId.title,
          create: feature.create || false,
          delete: feature.delete || false,
          update: feature.update || false,
          read: feature.read || false,
          type: feature.featuresId.type,
          status: feature.status,
          children: [],
        }));

        const groupsFeaturesData = groupsFeatures.map((feature) => ({
          _id: feature.featuresId._id,
          id: feature.featuresId._id,
          subtitle: feature.featuresId.subtitle,
          link: feature.featuresId.link,
          icon: feature.featuresId.icon,
          featuresIdParent: feature.featuresId.featuresIdParent,
          code: feature.featuresId.code,
          title: feature.featuresId.title,
          create: feature.create || false,
          delete: feature.delete || false,
          update: feature.update || false,
          read: feature.read || false,
          type: feature.featuresId.type,
          status: feature.status,
          children: [],
        }));

        features = usersFeaturesData;
        if (!usersFeaturesData.length && groupsFeaturesData.length) {
          features = groupsFeaturesData;
        } else if (groupsFeaturesData.length) {
          for await (const groupsFeature of groupsFeaturesData) {
            if (
              !features
                .map((feature) => feature._id.toString())
                .includes(groupsFeature._id.toString())
            ) {
              features.push(groupsFeature);
            }
          }
        }
        features = features.filter((gfd) => gfd.status);
      }

      const featuresAuth = features.map((f) => {
        const feature = { code: f.code, actions: [] };
        Object.values(actions).forEach((action) => {
          if (f[action]) feature.actions.push(action);
        });
        return feature;
      });

      const groups = features.filter((val) => !val.featuresIdParent);
      const notGroups = features.filter((val) => val.featuresIdParent);
      const recFunction = async (child) => {
        const children = notGroups.filter(
          (val) => val.featuresIdParent.toString() === child._id.toString()
        );
        if (children.length) {
          child.children = children;
          for await (const c of children) await recFunction(c);
        }
      };

      const data = [];
      for await (const group of groups) {
        const children = notGroups.filter(
          (val) => val.featuresIdParent.toString() === group._id.toString()
        );
        group.children = children;
        for await (const child of children) await recFunction(child);
        data.push(group);
      }

      return res.status(200).json({ menu: data, features: featuresAuth });
    } catch (e) {
      return errorCatch(e, res);
    }
  }

  static async getFeatures(req, res) {
    try {
      const features = await Features.aggregate([{ $sort: { order: 1 } }]);
      const groups = features.filter((val) => !val.featuresIdParent);
      const notGroups = features.filter((val) => val.featuresIdParent);

      const recFunction = async (child) => {
        const children = notGroups.filter(
          (val) => val.featuresIdParent.toString() === child._id.toString()
        );
        if (children.length) {
          child.children = children;
          for await (const c of children) await recFunction(c);
        }
      };

      const data = [];
      for await (const group of groups) {
        const children = notGroups.filter(
          (val) => val.featuresIdParent.toString() === group._id.toString()
        );
        group.children = children;
        for await (const child of children) await recFunction(child);
        data.push(group);
      }

      return res.status(200).json(data);
    } catch (e) {
      return errorCatch(e, res);
    }
  }
}
