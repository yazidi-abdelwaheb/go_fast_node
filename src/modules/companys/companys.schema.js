import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Company code is required."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Company code must be at least 3 characters long."],
      maxlength: [50, "Company code cannot exceed 50 characters."],
      match: /^[a-zA-Z0-9_]+$/,
    },
    label: {
      type: String,
      required: [true, "Company name is required."],
      lowercase: true,
      trim: true,
      minlength: [3, "Company name must be at least 3 characters long."],
      maxlength: [50, "Company name cannot exceed 50 characters."],
      match: /^[a-zA-Z0-9 ]+$/,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Companys", companySchema);

export default Company;
