import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function sendMail(to,subject,body){

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: body
    });
}



export  function templateMailResetPassword(clee){
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #007bff; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #333;">You recently requested to reset your password for your <strong>GO FAST</strong> account.</p>
            <p style="font-size: 16px; color: #333;">Here is your reset verification key:</p>
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #007bff; display: inline-block;">
            <h3 style="color: #007bff; font-size: 22px; margin: 0;">${clee}</h3>
            </div>
            <p style="font-size: 16px; color: #333;">Please enter this key on our website to reset your password.</p>
            <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
            <p style="font-size: 14px; color: #666;"><strong>This code is valid for 30 minutes.</strong></p>
            <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #999;">&copy; 2025 GO FAST. All rights reserved.</p>
        </div>
    `
}


export  function templateMailVerifyMail(clee){
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #007bff; text-align: center;">Your Verification Key</h2>
            <p style="font-size: 16px; color: #333;">Thank you for signing up. Here is your verification key:</p>
            
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #007bff; display: inline-block;">
                <h3 style="color: #007bff; font-size: 22px; margin: 0;">${clee}</h3>
            </div>
            
            <p style="font-size: 16px; color: #333;">Please enter this key on our website to confirm your registration.</p>
            <p style="font-size: 14px; color: #666;"><strong>This code is valid for 10 minutes.</strong></p>
            
            <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #999;">&copy; 2025 Your GO FAST. All rights reserved.</p>
        </div>
    `
}