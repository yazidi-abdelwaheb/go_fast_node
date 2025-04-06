import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  CustomError,
  generation_JWT_Token,
  errorCatch,
  contentMails,
  subjects,
  sendMail,
  templateMails,
  CODE_EXPIRE_IN_FORGET_PASSWORD,
  CODE_EXPIRE_IN_ACTIVATE_ACCOUNT,
  CODE_EXPIRE_IN_LOGIN_SUPER,
  TOKEN_EXPIRE_IN_USERS,
  TOKEN_EXPIRE_IN_SUPER,
  ATTEMPTS_OF_CODE_VALIDATION,
  ATTEMPTS_OF_CODE_VALIDATION_SUPER,
} from "../../shared/shared.exports.js";
import Users from "../users/users.shema.js";
import GroupFeature from "../groups/group-feature.shema.js";

export default class AuthController {
  static async login(req, res) {
    /**
     * #swagger.summary = "Login"
     */
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
            groupsId: user.groupId,
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
      errorCatch(error, res);
    }
  }

  static async verifyLoginSuper(req, res) {
    /**
     * #swagger.summary = "Verify login super"
     */
    try {
      const { code , email } = req.body;

      const user = await Users.findOne({ email });

      if (!user.isActive)
        throw new CustomError(
          "your account is not active. please contact your administrator for active your account.",
          400
        );

      await verifyCode(user, code);

      // Remove the code field using $unset with an empty null value
      await Users.updateOne({ _id: user._id }, { $unset: { code: null } });

      const token = generation_JWT_Token(user, TOKEN_EXPIRE_IN_SUPER);
      res.status(200).json({ message: "User logged in successfully.", token });
    } catch (error) {
      console.log(error);
      
      errorCatch(error, res);
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
      errorCatch(error, res);
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
      errorCatch(error, res);
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
      errorCatch(error, res);
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
      errorCatch(error, res);
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
      errorCatch(error, res);
    }
  }

  static async resetPassword(req, res) {
    /**
     * #swagger.summary = "Reset password"
     */
    try {
      const { email, password, code } = req.body;
      const user = await Users.findOne({ email });

      await verifyCode(user, code);

      // Remove the code field using $unset with an empty null value and change password
      await Users.updateOne(
        { _id: user._id },
        { $unset: { code: null, password: password } }
      );
      res.status(200).json({ message: "Password updated successfully ." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async updatePassword(req, res) {
    /**
     * #swagger.summary = update password before 1st login
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
      const { password, email } = req.body;
      const user = await Users.findOneAndUpdate(
        { email },
        { $unset: { code: null, password: password } },
        { new: true }
      );

      if (user.groupId) {
        const defaultFeature = await GroupFeature.findOne({
          groupsId: user.groupId,
          defaultFeature: true,
        }).populate("featureId");
        if (defaultFeature) {
          user.defaultLink = defaultFeature.featureId.link;
        }
      }
      const token = generation_JWT_Token(user, TOKEN_EXPIRE_IN_USERS);
      res.status(200).json({ message: "User logged in successfully.", token });
    } catch (error) {
      errorCatch(error, res);
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
 * @param {object} user Users shema object
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
  if (user.code.key !==  code || user.code.expireIn <= Date.now()) {
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
