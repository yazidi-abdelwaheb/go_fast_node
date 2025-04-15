import Orders from "./orders.schema.js";
import { errorCatch, getPaginatedData } from "../../shared/shared.exports.js";
import { Types } from "mongoose";

const model = Orders;

export default class OrdersController {
  static async getList(req, res) {
    /**
     * 
     * #swagger.summary  = "Get list of Orders."
     */

    try {
      const productId = req.params.productId;
      const userIdSelected = req.params.userId;

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      let condictions = {};
      if (productId) {
        // case :  get all Orders in product
        condictions["product"] = new Types.ObjectId(productId);
      }

      if (req.user.type === "user") {
        // case : get all Orders of user connected if user type : "user"
      }

      if (userIdSelected) {
        // case : get all Orders of user with id
      }

      const { data, totalElement, totalPages } = await getPaginatedData(
        model,
        page,
        limit,
        search,
        [
          "distination.government",
          "distination.ville",
          "client.fullname",
          "client.phone_number",
        ],
        condictions,
        {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productId",
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
      errorCatch(error, req, res);
    }
  }

  static async createOne(req, res) {
    /**
     * 
     * #swagger.summary = "add a new order"
     * #swagger.requestBody = {
            required: true,
            content: {
              "application/json": {
                example:{
                  "order" : {
                      "product": "Chaise pliante - noire",
                      "type": "building",
                      "distination": {
                          "entrance": "Porte B",
                          "address_details": "Appartement 3ème étage, immeuble 4",
                          "phone": "+21612345678",
                          "place": {
                          "placeId": "place_abc123",
                          "name": "Résidence El Amen",
                          "address": "Rue de la liberté, Tunis",
                          "location": {
                              "lat": 36.8065,
                              "lng": 10.1815
                          }
                          }
                      },
                      "pick_up": {
                          "entrance": "Entrée principale",
                          "address_details": "Boutique 12, RDC",
                          "phone": "+21698765432",
                          "place": {
                          "placeId": "place_xyz456",
                          "name": "Centre Commercial Carrefour",
                          "address": "La Marsa, Tunis",
                          "location": {
                              "lat": 36.8781,
                              "lng": 10.3245
                          }
                          }
                      }
                  }
                }
              }
            }
        }
     */
    try {
      const { order } = req.body;
      const newOne = new model({
        productDesc: typeof order.product === "string" ? order.product : null,
        userId: req.user._id,
        type: order.type,
        destination: {
          entrance: order.distination.entrance,
          address_details: order.distination.address_details,
          phone: order.distination.phone,
          place: {
            placeId: order.distination.place.placeId,
            name: order.distination.place.name,
            address: order.distination.place.address,
            location: {
              lat: order.distination.place.location.lat,
              lng: order.distination.place.location.lng,
            },
          },
        },
        pick_up: {
          entrance: order.pick_up.entrance,
          address_details: order.pick_up.address_details,
          phone: order.pick_up.phone,
          place: {
            placeId: order.pick_up.place.placeId,
            name: order.pick_up.place.name,
            address: order.pick_up.place.address,
            location: {
              lat: order.pick_up.place.location.lat,
              lng: order.pick_up.place.location.lng,
            },
          },
        },
      });
      //newOne.userId =  new Types.ObjectId(req.user._id)
      const shared_code = (await newOne.save()).code;
      res.status(201).json({
        message: "order created successfully.",
        code: shared_code,
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    /**
     * 
     * #swagger.summary = "Read one of Orders."
     */
    try {
      const orderId = req.params.id;
      const order = await model.findById(orderId).populate("productId");
      res.status(200).json(order);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * 
     * #swagger.summary = "update one of Orders."
     * * #swagger.requestBody = {
            required: true,
            content: {
              "application/json": {
                example:{
                  order :  {
                    productId: "productId",
                    client : {
                      fullname : "jhon smith",
                      phone_number : "+212678901234"
                    },
                    distination : {
                      government : "nabeul",
                      ville : "nabeul",
                      link_to_position : "https://www.google.com/maps/example"
                    }
                  }
                }
              }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { order } = req.body;
      await model.updateOne(
        { _id },
        {
          productId: order.productId,
          client: order.client,
          distination: order.distination,
        }
      );

      res.status(200).json({ message: "order updated successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * 
     * #swagger.summary ="Delete one of Orders."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });

      res.status(200).json({ message: "order deleted successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
