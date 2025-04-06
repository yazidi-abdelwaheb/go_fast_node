import { model, Schema } from "mongoose";
import {
  Orderstatus,
  generateUniqueCodeForOrders,
} from "../../shared/shared.exports.js";
const Orderschema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    distination: {
      government: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Government distination is required."],
        match: [/^[a-zA-Z0-9 ]+$/, "Please entre a valid government name."],
      },
      ville: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "ville distination is required."],
        match: [/^[a-zA-Z0-9 ]+$/, "Please entre a valid ville name."],
      },
      //link google map to position client
      link_to_position: {
        type: String,
        required : true,
      },
    },
    client: {
      fullname: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "distinateur fullname is required."],
        match: [/^[a-zA-Z0-9 ]+$/, "Please entre a valid fullname."],
      },
      phone_number: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "distinateur phone number is required."],
        match: [/^[+ 0-9]+$/, "Please entre a valid phone number."],
      },
    },
    status: {
      type: String,
      enum: Object.values(Orderstatus),
      default : Orderstatus.pending,
    },
    shared_code: {
      type: String,
    },
  },
  { timestamps: true }
);

Orderschema.virtual("search").get(function () {
  return `${this.distination.governament} ${this.distination.ville} ${this.client.fullname} ${this.client.phone_number} ${this.status}`;
});

Orderschema.pre("save", async function (next) {
  this.shared_code = await generateUniqueCodeForOrders();
  next();
});

const Orders = model("Orders", Orderschema);

export default Orders;
