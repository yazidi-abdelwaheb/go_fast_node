import { Schema, model } from "mongoose";

const textSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    fr: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
    es: {
      type: String,
      required: true,
    },
    ar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



const Texts = model("Texts", textSchema);

export default Texts;
