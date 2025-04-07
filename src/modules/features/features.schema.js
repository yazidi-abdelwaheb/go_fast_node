import { Schema, model } from "mongoose";
import { FeaturesTypeEnum, featureStatus } from "../../shared/shared.exports.js";

const featureschema = new Schema(
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
      maxlength: 200,
      trim : true,
      lowercase : true,
    },
    order: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(featureStatus),
      required: true,
    },
    featuresIdParent: {
      type: Schema.Types.ObjectId,
      ref: "Features",
    },
  },
  { timestamps: true }
);

featureschema.virtual("search").get( function () {
  return `${this.code} ${this.title}`;
});

const Features = model("Features", featureschema);

export default Features;
