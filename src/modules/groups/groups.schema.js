import { Schema, model } from "mongoose";

const Groupschema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
    code: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9_]+$/,
    },
    label: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      match: /^[A-Za-z0-9 ]+$/,
    },
  },
  { timestamps: true }
);

const Groups = model("Groups", Groupschema);

export default Groups;
