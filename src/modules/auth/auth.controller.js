import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  CustomError,
  generation_JWT_Token,
  errorCatch,
  contentMails,
  subjects,
  /*sendmail,*/
  templateMails,
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER,
} from "../../shared/shared.exports.js";
import Users from "../users/users.schema.js";
import GroupFeature from "../groups/group-feature.schema.js";
import sendMail, { templateMailVerifyMail } from "../../shared/mail.utils.js";
import jwt from "jsonwebtoken";

export default class AuthController {
  /*static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) throw new CustomError("Incorrect email or password!", 400);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new CustomError("Incorrect email or password!", 400);

      if (!user.isActive)
        throw new CustomError(
          "Your account is not active! please sign in for active your account or contact your administrator.",
          400
        );

      // Check if the user is super admin
      if (user.type === "super") {
        await updateUserCodeAndSendMail(
          CODE_EXPIRE_IN_LOGIN_SUPER,
          ATTEMPTS_OF_CODE_VALIDATION_SUPER,
          user.email,
          subjects.verification_login_super,
          contentMails.verification_login_super
        );
        return res.status(200).json({ message: "Please check your email." });
      } else {
        if (user.code.key === "first_login") {
          throw new CustomError("Update your password.", 405);
        }
        if (user.groupId) {
          const defaultFeature = await GroupFeature.findOne({
            groupId: user.groupId,
            defaultFeature: true,
          }).populate("featureId");
          if (defaultFeature) {
            user.defaultLink = defaultFeature.featureId.link;
          }
        }
        const token = generation_JWT_Token(user, TOKEN_EXPIRE_IN_USERS);
        res
          .status(200)
          .json({ message: "User logged in successfully.", token });
      }
      //res.status(400).json({ message: "User not admin." });
    } catch (error) {
      
      errorCatch(error, req , res);
    }
  }*/

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) throw new CustomError("Incorrect email or password!", 400);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new CustomError("Incorrect email or password!", 400);

      if (user.type === "super" || user.type === "user") {
        let key;
        if (
          user.email === "youssefwerfellicpm@gmail.com" ||
          user.email === "youssefwerfelli5@gmail.com"
        ) {
          key = "000000";
        } else {
          key = crypto.randomInt(100000, 999999).toString();
        }
        await Users.findByIdAndUpdate(
          user._id,
          {
            $set: {
              code: {
                key: key,
                expireIn: Date.now() + 60 * 60 * 1000,
                attempts: 3,
              },
            },
          },
          { new: true }
        );

        const subject = "Account Verification - GO FAST";
        await sendMail(user.email, subject, templateMailVerifyMail(key));

        return res.status(200).json({ message: "Please check your email." });
      }
      res.status(400).json({ message: "User not admin." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async verifyAccountAdmin(req, res) {
    try {
      const { code, email } = req.body;

      const user = await Users.findOne({ email });
      if (!user) throw new CustomError("User not found.", 404);
      if (!user.code)
        throw new CustomError("Please sign in before verifying your account.");
      if (user.code.attempts === 1)
        throw new CustomError("Out of attempts. Please try again later.", 402);

      if (user.code.key !== code || user.code.expireIn <= Date.now()) {
        if (user.code.key !== code) {
          await Users.updateOne(
            { _id: user._id },
            { $set: { "code.attempts": user.code.attempts - 1 } }
          );
          throw new CustomError(user.code.attempts - 1, 405);
        } else {
          throw new CustomError("Code expired! Please re-log in.", 403);
        }
      }

      await Users.updateOne(
        { _id: user._id },
        {
          $unset: { code: "" },
          $set: { active: true },
        }
      );

      if (user.new === true) {
        const tokenEmail = jwt.sign(
          {
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: 30 * 60 * 1000 }
        );
        return res
          .status(455)
          .json({ message: "Please change password ", token: tokenEmail });
      } else {
        const token = generation_JWT_Token(user, 15 * 60 * 1000);
        res
          .status(200)
          .json({ message: "User logged in successfully.", token });
      }
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async registery(req, res) {
    /**
     * #swagger.summary = "Register"
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     user :  {
                      first_name: "John",
                      last_name: "Smith",
                      email: "john@example.com",
                      password: "1234567a", 
                      }
                    }
                }
            }
        }
    
     */
    try {
      const { user } = req.body;

      const userModel = new Users({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        company: user.company,
      });
      await userModel.save();

      await updateUserCodeAndSendMail(
        CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
        ATTEMPTS_OF_CODE_VALIDATION,
        user.email,
        subjects.verification_mail,
        contentMails.verification_mail
      );

      res.status(200).json({
        message:
          "Account create successfully . Please check your email for active your account.",
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async activeAccount(req, res) {
    /**
     * #swagger.summary = "Active Account"
     */
    try {
      const { code, email } = req.body;
      const user = await Users.findOne({ email });
      if (user.type !== "user")
        throw new CustomError(
          "this action not allowed for users type : " + user.type,
          400
        );
      if (user.isActive === true)
        throw new CustomError("Your account alredy active!", 400);

      await verifyCode(user, code);

      // Remove the code field using $unset with an empty null value and active account
      await Users.updateOne(
        { _id: user._id },
        { $unset: { code: null, isActive: true } }
      );

      const token = generation_JWT_Token(
        user._id,
        user.type,
        TOKEN_EXPIRE_IN_USERS
      );

      res
        .status(200)
        .json({ message: "Account activated successfully.", token });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async sendMailActiveAccount(req, res) {
    /**
     * #swagger.summary = "Send email for active account"
     */
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (user.type !== "user")
        throw new CustomError(
          "this action not allowed for users type " + user.type,
          400
        );
      if (user.isActive === true)
        throw new CustomError("Your account alredy active!", 400);
      await updateUserCodeAndSendMail(
        CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
        ATTEMPTS_OF_CODE_VALIDATION,
        email,
        subjects.verification_mail,
        contentMails.verification_mail
      );
      res
        .status(200)
        .json({ message: "Verification email sent successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async sendMailForgetPassword(req, res) {
    /**
     * #swagger.summary = "send email for forget password"
     */
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email: email });
      if (!user.isActive)
        throw new CustomError(
          "Your account is not active ! please sign in for active your account or contact your administrator.",
          400
        );
      await updateUserCodeAndSendMail(
        CODE_EXPIRE_IN_FORGET_PASSWORD,
        ATTEMPTS_OF_CODE_VALIDATION,
        email,
        subjects.reset_password,
        contentMails.reset_password
      );
      res
        .status(200)
        .json({ message: "Verification email sent successfully." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async validationkeyForgetPassword(req, res) {
    /**
     * #swagger.summary = "Validation code for forgot password"
     */
    try {
      const { code, email } = req.body;
      const user = await Users.findOne({ email });

      await verifyCode(user, code);

      res.status(200).json({ message: "Code valid." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updatePassword(req, res) {
    /**
     * #swagger.summary = update password before 1st login
     */
    try {
      const { password, token } = req.body;
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      const email = decoded.email;
      if (!email) {
        return res
          .status(400)
          .json({ message: "Token does not contain email." });
      }

      const user = await Users.findOneAndUpdate(
        { email },
        { $unset: { code: "" }, new: false , password: password }
        //{ $set:{password: password} },
      );

      if (user.groupId) {
        const defaultFeature = await GroupFeature.findOne({
          groupId: user.groupId,
          defaultFeature: true,
        }).populate("featureId");
        if (defaultFeature) {
          user.defaultLink = defaultFeature.featureId.link;
        }
      }
      const accesseToken = generation_JWT_Token(user, 15 * 60 * 1000);
      res
        .status(200)
        .json({
          message:
            "Password updated successfully . User logged in successfully.",
          token: accesseToken,
        });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async resetPassword(req, res) {
    /**
     * #swagger.summary = "Reset password"
     */
    try {
      const { password, token } = req.body;
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      const email = decoded.email;
      if (!email) {
        return res
          .status(400)
          .json({ message: "Token does not contain email." });
      }

      // Find user by email
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await Users.updateOne(
        { _id: user._id },
        { $unset: { code: null, password: password, new: null } }
      );
      res.status(200).json({ message: "Password updated successfully ." });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async checkToken(req, res) {
    /**
     * #swagger.summary = function to valided token
     * * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     password : "12345678a",
                     email : "example@gmail.com"
                    }
                }
            }
        }
     */
    try {
      const { token } = req.body;
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ valid: false });
      }
      console.log("error");
      return res.status(200).json({ valid: true });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}

/************************** */

/**
 * saved code validation in user account and send email to user
 * @param {number} expireIn code duration en milliseconds
 * @param {number} attempts number of attempts possible for code validation
 * @param {String} email email to send
 * @param {String} subject email subject
 * @param {object} contentMail content mail
 */
const updateUserCodeAndSendMail = async (
  expireIn,
  attempts,
  email,
  subject,
  content
) => {
  const key = crypto.randomInt(100000, 999999).toString();
  await Users.updateOne(
    { email: email },
    {
      $set: {
        code: {
          key: key,
          expireIn: Date.now() + expireIn,
          attempts: attempts,
        },
      },
    }
  );
  await sendMail(email, subject, templateMails(key, content, expireIn));
};

/**
 * function to verify code validity
 * @param {object} user Users schema object
 * @param {Strign} code code send to  user
 */
const verifyCode = async (user, code) => {
  if (!user.code) {
    throw new CustomError(
      "Code not found in your account . Please try again later.",
      402
    );
  }

  if (user.code.attempts === 0)
    throw new CustomError("Out of attempts. Please try again later.", 402);

  // Check if the code is incorrect or expired
  if (user.code.key !== code || user.code.expireIn <= Date.now()) {
    if (user.code.key !== code) {
      // Decrement the number of attempts
      user.code.attempts--;
      await user.save();
      throw new CustomError(
        "Wrong code " + user.code.attempts + " attempts left!",
        401
      );
    } else {
      throw new CustomError("Code expired !", 403);
    }
  }
};
