import Users from "./users.schema.js";
import {
  CustomError,
  errorCatch,
  getPaginatedData,
  uploadImage,
  UserStatusEnum,
  UserTypeEnum,
} from "../../shared/shared.exports.js";
import UserFeature from "../user-feature/user-feature.schema.js";
import fs from "fs";
import path from "path";
import { MulterError } from "multer";
import { type } from "os";
const model = Users;
export default class UsersController {
  static async getList(req, res) {
    /**
     * 
     * #swagger.summary  = "Get list of users."
     * 
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";
      const filterStatus = req.query.filterStatus || "";
      const filterNewOld = req.query.filterNewOld || "";
      const filtergroup = req.query.filtergroups || "";

      const filter = { type: { $ne: "super" } };
      if (filterStatus) {
        filter.status = { $in: filterStatus.split(",") };
      }
      if (filterNewOld === "new") {
        filter["new.value"] = true;
      } else if (filterNewOld === "old") {
        filter["new.value"] = { $exists: false };
      }
      if (filtergroup) {
        filter["groupId.code"] = { $in: filtergroup.split(",") };
      }

      const { data, totalElement, totalPages } = await getPaginatedData(
        model,
        page,
        limit,
        search,
        ["first_name", "last_name", "email"],
        filter,
        {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupId",
        }
      );

      data.map((e) => {
        const AVATAR_BASE_URL = `${process.env.HOST}:${process.env.PORT}/private`;
        if (e.avatar) {
          e.avatar = `${AVATAR_BASE_URL}${e.avatar}`;
        }
      });
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

  static async getAll(req, res) {
    /**
     * 
     * #swagger.summary = "get List all Users"
     * 
     */
    try {
      const list = await Users.find(
        {
          companyId: req.user.companyId,
          _id: { $ne: req.user._id },
        },
        {
          first_name: 1,
          last_name: 1,
          email: 1,
          avatar: 1,
        }
      );
      res.status(200).json(list);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async createOne(req, res) {
    /**
     * 
     * #swagger.summary = "create a new user"
     * 
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     user :  {
                      first_name: "John",
                      last_name: "Smith",
                      email: "john@example.com",
                      password: "1234567a", 
                      groupId: "groupId",  
                      }
                    }
                }
            }
        }
    
     */
    try {
      const { user } = req.body;

      await new Users({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        companyId: req.user.companyId,
        type: UserTypeEnum.user,
        isActive: true,
        groupId: user.groupId._id,
        new: {
          value: true,
          password: user.password,
        },
      }).save();

      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    /**
     * 
     * #swagger.summary = "Read one by Id of users."
     */
    try {
      const userId = req.params.id;
      const user = await model.findById(userId).populate("groupId");
      res.status(200).json(user);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * 
     * #swagger.summary = "update one of users."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     user :  {
                      first_name: "John",
                      last_name: "Smith",
                      email: "john@example.com",
                      password: "1234567a",
                      type: "user",
                      groupId: "groupId",
                      lang : "en",  
                      }
                    }
                }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { user } = req.body;
      const updateData = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        groupId: user.groupId,
      };

      if (user.new && user.new.value) {
        updateData["new.password"] = user.password;
      }

      await model.updateOne({ _id }, updateData);

      res.status(200).json({ message: "user updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * 
     * #swagger.summary ="Delete one of users."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });
      await UserFeature.deleteMany({ userId: _id });

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async me(req, res) {
    /**
     * 
     * #swagger.summary = Get Info user connected
     */
    try {
      const { _id } = req.user;
      const user = await Users.findOne({ _id });

      res.status(200).json(user);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateMyAccount(req, res) {
    /**
     * 
     * #swagger.summary = "Update my account"
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     user :  {
                      first_name: "John",
                      last_name: "Smith",
                      email: "john@example.com",
                      password: "1234567a", 
                      lang : "en",
                      }
                    }
                }
            }
        }
     */
    try {
      const userId = req.user._id;
      const { user } = req.body;
      await Users.updateOne(
        { _id: userId },
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
          lang: user.lang,
        }
      );
      res.status(200).json({ message: "Account updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateMyLanguage(req, res) {
    /**
     * 
     * #swagger.summary = update language user conected 
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     lang : "en"
                    }
                }
            }
        }
     */
    try {
      const userId = req.user._id;
      const { lang } = req.body;
      await Users.updateOne({ _id: userId }, { lang: lang });

      res.status(200).json({ message: "Language updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateMyStatus(req, res) {
    /**
     * 
     * #swagger.summary = update Status user conected 
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     status : "online"
                    }
                }
            }
        }
     */
    try {
      const userId = req.user._id;
      const { status } = req.body;
      await Users.updateOne({ _id: userId }, { status: status });

      res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateMyAvatar(req, res) {
    /**
     * 
     * #swagger.summary = "Update the avatar of the conncted user. Please use postman for testing this endpoint."
     */

    try {
      const userId = req.user._id;

      // Use upload middleware for image handling
      const upload = uploadImage("private", "avatar");

      upload(req, res, async (err) => {
        if (err instanceof MulterError) {
          throw new CustomError(
            "Error uploading avatar. Please try again later.",
            500
          );
        } else if (err) {
          throw new CustomError(err.message, 400);
        }

        // Check if a file has been uploaded
        if (!req.file) {
          throw new CustomError("No avatar uploaded. Please try again.", 400);
        }

        // Get the old avatar path to delete it
        const user = await Users.findById(userId).select("avatar");
        const oldAvatar = user?.avatar;

        if (oldAvatar) {
          const oldAvatarPath = path.join("src", "private", oldAvatar);
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath); // Delete old avatar from filesystem
          }
        }

        // Construct new avatar path
        const avatarUrl = `/avatars/${req.file.filename}`;

        // Update user with new avatar URL
        await Users.updateOne({ _id: userId }, { avatar: avatarUrl });

        res.status(200).json({
          message: "Avatar updated successfully.",
          avatar: avatarUrl,
        });
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
