import { Schema , model } from "mongoose";

const UserFeatureschema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  featureId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Features',
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
    required: false,
  },
}, { timestamps: true });

const UserFeature =  model('UserFeature', UserFeatureschema);

export default UserFeature;