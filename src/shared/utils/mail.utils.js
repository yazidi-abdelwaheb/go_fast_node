import nodemailer from "nodemailer";
import ms from "ms";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using gmail service
 *
 * @param {string} to email address to send
 * @param {string} subject subject to send
 * @param {string} body string to html template
 * @returns {Promise} promise
 */
export default async function sendMail(to, subject, body) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: body,
  });
}

/**
 * const for define a subjects mails
 */
export const subjects = {
  reset_password: "Reset Password - GO FAST",
  verification_mail: "Mail Verification - GO FAST",
  verification_login_super: "Log In Verification - GO FAST",
};

/**
 * const for define a content mails
 */
export const contentMails = {
  reset_password: {
    title: "Reset Your Password",
    discription1:
      "You recently requested to reset your password for your <strong>GO FAST</strong> account.",
    discription_code: "Here is your reset verification code",
    discription2:
      "Please enter this code on our website to reset your password.<br/>If you did not request this, please ignore this email.",
  },
  verification_mail: {
    title: "Your Verification code",
    discription1:
      "Thank you for signing up to <strong>GO FAST</strong> services.",
    discription_code: "Here is your verification code",
    discription2:
      "Please enter this code on our website to confirm your registration.",
  },
  verification_login_super: {
    title: "Your Verification Account code",
    discription1:
      "You recently requested to log in your <strong>GO FAST</strong> account.",
    discription_code: "Here is your verification code",
    discription2:
      "Please enter this code on our website to confirm your Sing In.",
  },
};

/**
 * code html for define a templates mails send to user .
 * @param {String} key code validation
 * @param {object} content content template
 * @param {number} validation_date validation_date number en milliseconds
 * @returns {String} string as a html code
 */
export function templateMails(code, content, validation_date) {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #007bff; text-align: center;">${
              content.title
            }</h2>
            <p style="font-size: 16px; color: #333;">${content.discription1}</p>
            <p style="font-size: 16px; color: #333;">${
              content.discription_code
            }:</p>
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #007bff; display: inline-block;">
            <h3 style="color: #007bff; font-size: 22px; margin: 0;">${code}</h3>
            </div>
            <p style="font-size: 16px; color: #333;">${content.discription2}</p>
            <p style="font-size: 14px; color: #666;"><strong>This code is valid for ${ms(
              validation_date,
              { long: true }
            )}.</strong></p>
            <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #999;">&copy; 2025 GO FAST. All rights reserved.</p>
        </div>
    `;
}
