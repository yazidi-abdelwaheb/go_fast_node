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
      length: [8, "Phone number be at 8 characters long"],
    },
    city : {
        gouvernorat : String,
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
