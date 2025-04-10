import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import {
  UserTypeEnum,
  generateUniqueUsername,
  UserLanguagesEnum,
  UserStatusEnum,
} from "../../shared/shared.exports.js";

const userSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      match: /^[a-zA-Z0-9]+$/,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [20, "Last name cannot exceed 20 characters"],
    },
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      match: /^[a-zA-Z0-9]+$/,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [20, "First name cannot exceed 20 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    new: {
      value:{
        type :Boolean,
      },
      password : {
        type:String,
        minlength: [8, "Password must be at least 8 characters long"],
      }
    },
    code: {
      key: {
        type: String,
        length: [6, "Code must be at least 6 characters long"],
        math: /^[0-9]+$/,
      },
      expireIn: Date,
      attempts: { type: Number },
    },
    type: {
      type: String,
      enum: Object.values(UserTypeEnum),
      default: UserTypeEnum.user,
    },
    isActive: { type: Boolean, default: false },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Groups",
    },
    lang: {
      type: String,
      enum: Object.values(UserLanguagesEnum),
      default: UserLanguagesEnum.en,
    },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      default: UserStatusEnum.invisible,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Hash the password before saving it to the database
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Generate a unique username before saving it to the database
  this.username = await generateUniqueUsername(this.first_name);
  next();
});
userSchema.pre(["updateOne", "findOneAndUpdate" , "findByIdAndUpdate" ], async function (next) {
  const update = this.getUpdate();
  // Hash the password before update it to the database if the password is updated
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  // Generate a unique username before update it to the database if the first_name is updated

  if (update.first_name) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      update.username = await generateUniqueUsername(
        update.first_name || doc.first_name
      );
    }
  }

  next();
});


function formatAvatar(doc) {
  const AVATAR_BASE_URL = `${process.env.HOST}:${process.env.PORT}/private`;
  if (doc && doc.avatar) {
    doc.avatar = `${AVATAR_BASE_URL}${doc.avatar}`;
  }
}

// Hook pour find, findOne, etc.
userSchema.post(["aggregate","find", "findOne", "findById"], function (result) {
  if (Array.isArray(result)) {
    result.forEach(e=>formatAvatar(e));
  } else {
    formatAvatar(result);
  }
});

const Users = model("Users", userSchema);

export default Users;
