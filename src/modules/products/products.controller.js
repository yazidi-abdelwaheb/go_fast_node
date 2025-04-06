import Products from "./products.shema.js";
import {
  CustomError,
  errorCatch,
  getPaginatedData,
} from "../../shared/shared.exports.js";
import { Types } from "mongoose";
import Orders from "../orders/orders.controller.js";
const model = Products;

export default class ProductsController {
  static async getList(req, res) {
    /**
     * #swagger.summary = "get list of products"
     */
    try {
      const userIdSelected = req.params.userId;

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      let condictions = {};

      if (req.user.type === "user") {
        // case : get all products of user connected
        condictions["userId"] = new Types.ObjectId(req.user._id);
      }

      if (userIdSelected) {
        // case : get all products of user by id
        condictions["userId"] = new Types.ObjectId(userIdSelected);
      }

      const { data, totalElement, totalPages } = await getPaginatedData(
        model,
        page,
        limit,
        search,
        ["label","price"],
        condictions,
        {
          from : "users",
          localField:"userId",
          foreignField:"_id",
          as: "userId"
        }
      );

      res.status(200).json({
        total : totalElement,
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
     * #swagger.summary = "create new product products."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     product :  {
                      label: "example",
                      price: 15.6,
                      }
                    }
                }
            }
        }
     */
    try {
      const { product } = req.body;
      await new model({
        label: product.label,
        price: product.price,
        userId: new Types.ObjectId(req.user._id),
      }).save();
      res.status(201).json({ message: "product created successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary = "Read one by Id of products."
     */
    try {
      const productId = req.params.id;
      const product = await model.findById(productId);
      res.status(200).json(product);
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * #swagger.summary = "update one of products."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     product :  {
                      label: "example",
                      price: 15.6,
                      }
                    }
                }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { product } = req.body;
      await model.updateOne(
        { _id },
        { label: product.label, price: product.price }
      );

      res.status(200).json({ message: "product updated successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one of products."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });
      await Orders.deleteMany({ productId: _id }); // all Orders associated with product are deleted

      res.status(200).json({ message: "product deleted successfully. And all Orders associated with product are deleted !" });
    } catch (error) {
      errorCatch(error, res);
    }
  }
}
