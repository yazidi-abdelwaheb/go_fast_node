import {
  errorCatch,
  CustomError,
  getPaginatedData,
} from "../../shared/shared.exports.js";
import Group from "./groups.schema.js";
import { Types } from "mongoose";
import GroupFeature from "./group-feature.schema.js";

export default class GroupController {
  static async getList(req, res) {
    /**
     * #swagger.summary = "Get all groups"
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      const { data, totalElement, totalPages } = await getPaginatedData(
        Group,
        page,
        limit,
        search,
        ["code", "label"],
        {},
        null
      );

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
     * #swagger.summary = "Create one groups"
     * * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     group :  {
                      code: "group",
                      label: "Group",
                      },
                      groupFeatures : [
                         {
                          featureId: "featureId",
                          list: true,
                          create: true,
                          update: true,
                          delete: true,
                          status: true,
                          defaultFeature : true
                        },
                        
                      ]
                    }
                }
            }
        }
     */
    try {
      const { group, groupFeature } = req.body;

      /// Create a new group
      const newOne = await new Group({
        code: group.code,
        label: group.label,
        companyId: new Types.ObjectId(req.user.companyId),
      }).save();

      /// Create a new groupFeatures
      for await (const _groupFeature of groupFeature) {
        if (_groupFeature.featureId) {
          const newgroupFeature = new GroupFeature({
            companyId: new Types.ObjectId(req.user.companyId),
            featureId: new Types.ObjectId(_groupFeature.featureId._id),
            groupId: new Types.ObjectId(newOne._id),
          });
          if (_groupFeature.list) {
            newgroupFeature.list = true;
          }
          if (_groupFeature.create) {
            newgroupFeature.create = true;
          }
          if (_groupFeature.update) {
            newgroupFeature.update = true;
          }
          if (_groupFeature.delete) {
            newgroupFeature.delete = true;
          }
          if (_groupFeature.status) {
            newgroupFeature.status = true;
          }
          if (_groupFeature.read) {
            newgroupFeature.read = true;
          }
          if (_groupFeature.defaultFeature) {
            newgroupFeature.defaultFeature = true;
          }
          await newgroupFeature.save();
        }
      }

      return res.status(201).json({ message: "Group created successfully." });
    } catch (e) {
      errorCatch(e, req, res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary = "Get one groups"
     */
    try {
      const { id } = req.params;
      const group = await Group.findById(id);
      return res.status(200).json(group);
    } catch (e) {
      errorCatch(e, req, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * #swagger.summary = "Update one groups"
     * * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     group :  {
                      code: "group",
                      label: "Group",
                      },
                      groupFeatures : [
                         {
                          featureId: "featureId",
                          list: true,
                          create: true,
                          update: true,
                          delete: true,
                          status: true,
                          defaultFeature : true
                        },
                        
                      ]
                    }
                }
            }
        }
     */
    try {
      const { group, groupFeature } = req.body;
      const _id = req.params.id;
      await Group.updateOne({ _id }, { code: group.code, label: group.label });

      await GroupFeature.deleteMany({ groupId: req.params.id });
      for await (const _groupFeature of groupFeature) {
        if (_groupFeature.featureId) {
          const newgroupFeature = new GroupFeature({
            featureId: new Types.ObjectId(_groupFeature.featureId._id),
            groupId: new Types.ObjectId(_id),
          });
          newgroupFeature.companyId = group.companyId;
          if (_groupFeature.list) {
            newgroupFeature.list = true;
          }
          if (_groupFeature.create) {
            newgroupFeature.create = true;
          }
          if (_groupFeature.update) {
            newgroupFeature.update = true;
          }
          if (_groupFeature.delete) {
            newgroupFeature.delete = true;
          }
          if (_groupFeature.status) {
            newgroupFeature.status = true;
          }
          if (_groupFeature.read) {
            newgroupFeature.read = true;
          }
          if (_groupFeature.defaultFeature) {
            newgroupFeature.defaultFeature = true;
          }
          await newgroupFeature.save();
        }
      }

      return res.status(200).json({ message: "group updated successfully." });
    } catch (e) {
      errorCatch(e, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary = "Delete one groups"
     */
    try {
      const _id = req.params.id;
      await Group.deleteOne({ _id });
      await GroupFeature.deleteMany({ groupId: _id });
      return res.status(200).json({ message: "Group deleted successfully " });
    } catch (e) {
      return (e.endpoint = `${req.method} ${req.originalUrl}`);
      errorCatch(e, req, res);
    }
  }

  static async get_groupFeatures(req, res) {
    try {
      const groupFeature = await GroupFeature.find({
        groupId: new Types.ObjectId(req.params.id),
      }).populate("featureId");
      return res.status(200).json(groupFeature);
    } catch (e) {
      
      errorCatch(e, req, res);
    }
}

  static async getAll(req, res) {
    try {
      const list = await Group.find(
        {
          companyId: new Types.ObjectId(req.user.companyId),
        },
        { code: 1, label: 1 }
      );

      return res.status(200).json(list);
    } catch (e) {
      errorCatch(e, req, res);
    }
  }
}
