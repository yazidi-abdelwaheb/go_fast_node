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
    required: true,
  },
  create: {
    type: Boolean,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
  update: {
    type: Boolean,
    required: true,
  },
  delete: {
    type: Boolean,
    required: true,
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
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
}, { timestamps: true });

const UserFeature =  model('UserFeature', UserFeatureschema);

export default UserFeature;