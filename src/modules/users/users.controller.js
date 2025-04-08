import Users from "./users.schema.js";
import { CustomError, errorCatch, getPaginatedData, uploadImage } from "../../shared/shared.exports.js";
import crypto from "crypto";
import GroupFeature from "../groups/group-feature.schema.js";
import { Types } from "mongoose";
const model = Users;

export default class UsersController {
  static async getList(req, res) {
    /**
     * #swagger.summary  = "Get list of users."
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";
      const filterStatus = req.query.filterStatus || "";

      const filter = { type: { $ne: "super" } };
      if (filterStatus) {
        filter.status = { $in: filterStatus.split(",") };
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

      res.status(200).json({
        total: totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data,
      });
    } catch (error) {
      errorCatch(e, req, res);
    }
  }

  static async createOne(req, res) {
    /**
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
                      type: "user",
                      groupId: "group Id",  
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
        type: user.type,
        isActive: true,
        groupId: user.groupId._id,
        code: {
          key: "first_login",
        },
      }).save();

      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    /**
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
      await model.updateOne(
        { _id },
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
          groupId: user.groupId,
        }
      );

      res.status(200).json({ message: "user updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one of users."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async me(req, res) {
    /**
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
     * #swagger.summary = Update avatar of the connected user. Please use Postman for testing this endpoint.
     */
    try {
      const userId = req.user._id;
  
      // Middleware to upload the image
      const upload = uploadImage("avatar");
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          throw new CustomError('Error uploading avatar. Please try again later.' , 500);
        } else if (err) {
          throw new Error(err.message);
        }
  
        // Check if the file has been uploaded successfully
        if (!req.file) {
          throw new Error('Avatar was not uploaded. Please try again later.');
        }
  
        // Update the user's avatar with the URL of the uploaded image
        const avatarUrl = `/avatars/${req.file.filename}`;
  
        // Update the user with the new avatar URL
        await Users.updateOne({ _id: userId }, { avatar: avatarUrl });
  
        res.status(200).json({
          message: "Avatar updated successfully.",
        });
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
  
}
