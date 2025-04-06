import { Schema, model } from "mongoose";

const groupFeatureShema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "company",
    },
    groupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Groups",
    },
    featureId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Features",
    },
    status: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Boolean,
      default: false,
    },
    defaultFeature: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const GroupFeature = model("GroupFeature", groupFeatureShema);

export default GroupFeature;
