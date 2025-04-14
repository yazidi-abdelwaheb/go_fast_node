import { model, Schema } from "mongoose";
import {
  OrderTypes,
  Orderstatus,
  generateUniqueCodeForOrders,
} from "../../shared/shared.exports.js";


const PointSchema = new Schema(
  {
    entrance: { type: String, trim: true },
    address_details: { type: String, trim: true },
    phone: { type: String, trim: true },
    place: {
      placeId: { type: String, trim: true },
      name: { type: String, trim: true },
      address: { type: String, trim: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    destination: {
      type: PointSchema,
      required: true,
    },
    pick_up: {
      type: PointSchema,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(OrderTypes),
      default: OrderTypes.building,
    },
    status: {
      type: String,
      enum: Object.values(Orderstatus),
      default: Orderstatus.pending,
    },
    code: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
OrderSchema.pre("save", async function (next) {
  this.code = await generateUniqueCodeForOrders();
  next();
});

const Orders = model("Orders", OrderSchema);

export default Orders;
