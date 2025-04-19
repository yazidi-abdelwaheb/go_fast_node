import {
  CustomError,
  errorCatch,
  getPaginatedData,
  GROUP_ID_CLIENTS,
  uploadImage,
  UserTypeEnum,
} from "../../shared/shared.exports.js";
import UsersController from "../users/users.controller.js";
import Users from "../users/users.schema.js";

import Clients from "./clients.schema.js";

const model = Clients;
export default class ClientsController extends UsersController {
  static async getList(req, res) {
    /**
     *
     * #swagger.summary  = "Get list of clients."
     *
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      const { data, totalElement, totalPages } = await getPaginatedData(
        model,
        page,
        limit,
        search,
        [
          "userId.first_name",
          "userId.last_name",
          "userId.email",
          "phone",
          "city",
        ],
        {},
        {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        }
      );

      const formattedData = data.map((item) => {
        const user = item.userId || {};
        const AVATAR_BASE_URL = `${process.env.HOST}:${process.env.PORT}/private`;
        if (user.avatar) {
          user.avatar = `${AVATAR_BASE_URL}${user.avatar}`;
        }
        return {
          ...user,
          ...item,
          userId: undefined,
        };
      });
      res.status(200).json({
        total: totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data: formattedData,
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async getAll(req, res) {
    /**
     *
     * #swagger.summary = "get List all clients"
     *
     */
    try {
      const list = await model.find().populate("userId");
      res.status(200).json(list);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async createOne(req, res) {
    /**
     * 
     * #swagger.summary = "create a new client"
     * 
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     client : {
                      first_name: "John",
                      last_name: "Smith",
                      email: "john@example.com",
                      password: "1234567a",   
                      city : "nabeul",
                      phone : "26727168",
                      accountType : "personal"
                     }
                    }
                }
            }
        }
    
     */
    try {
      const client  = req.body.user;

      const newUser = await new Users({
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        password: client.password,
        companyId: req.user.companyId,
        type: UserTypeEnum.clinet,
        groupId: GROUP_ID_CLIENTS,
        isActive: true,
        new: {
          value: true,
          password: client.password,
        },
      }).save();

      await new model({
        userId: newUser._id,
        city: client.city,
        type: client.type,
        phone: client.phone,
        accountType: client.accountType,
      }).save();

      res.status(201).json({ message: "Clients created successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    /**
     *
     * #swagger.summary = "Read one by Id of clients."
     */
    try {
      const userId = req.params.id;
      const user = await model.findById(userId).populate("userId");
      res.status(200).json(user);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * 
     * #swagger.summary = "update one of client."
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
      const { client } = req.body;
      const _id = req.params.id;

      const updateDataUser = {
        first_name: client.userId.first_name,
        last_name: client.userId.last_name,
        email: client.userId.email,
        password: client.userId.password,
      };

      if (client.userId.new && client.userId.new.value) {
        updateDataUser["new.password"] = client.userId.password;
      }

      await Users.updateOne({ _id: client.userId._id }, updateDataUser);

      await model.updateOne(
        { _id },
        {
          city: client.city,
          type: client.type,
          phone: client.phone,
        }
      );

      res.status(200).json({ message: "user updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     *
     * #swagger.summary ="Delete one of client."
     */
    try {
      const _id = req.params.id;
      const client = await model.findOneAndDelete({ _id });
      await Users.deleteOne({ _id: client.userId });

      res.status(200).json({ message: "client deleted successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  /*static async updateMyAccount(req, res) {
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
  /*try {
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
  }*/
}
