import { Schema, model } from "mongoose";
import {
  clientTypes,
} from "../../shared/shared.exports.js";

const clientSchema = new Schema(
  {
    userId : {
      type : Schema.Types.ObjectId,
      ref : "Users",
      required : true,
    },
    phone : {
      type : String,
      math: /^[+ 0-9]+$/,
      trim : true,
      required : [true , "Phone number is required"],
      length: [8, "Phone number must be exactly 8 digits long"],
      unique : [true , "Phone number is unique"],
    },
    city : {
        gouvernorat : {
          type : String
        },
        coordinates : [Number,Number]
    },
    accountType : {
      type : String,
      enum : Object.values(clientTypes),
      default : clientTypes.personal
    }
  }
);

const Clients = model("Clients", clientSchema);

export default Clients;
