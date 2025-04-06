import { Schema, model } from "mongoose";
import { FeaturesTypeEnum, FeaturesStatusEnum } from "../../shared/shared.exports.js";

const featureShema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique : true,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
      trim : true,
      match: /^[a-z0-9-]+$/,
    },
    title: {
      type: String,
      required: true,
      trim : true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_\- ]+$/,
    },
    type: {
      type: String,
      enum: Object.values(FeaturesTypeEnum),
      required: true,
    },
    subtitle: {
      type: String,
      minlength: 3,
      maxlength: 100,
      trim : true,
      match: /^[a-zA-Z0-9 ]+$/,
    },
    icon: {
      type: String,
    },
    link: {
      type: String,
      minlength: 1,
      maxlength: 100,
      trim : true,
      lowercase : true,
      match: /^[a-z0-9/-]+$/,
    },
    order: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(FeaturesStatusEnum),
      required: true,
    },
    featuresIdParent: {
      type: Schema.Types.ObjectId,
      ref: "Features",
    },
  },
  { timestamps: true }
);

featureShema.virtual("search").get( function () {
  return `${this.code} ${this.title}`;
});

const Features = model("Features", featureShema);

export default Features;
