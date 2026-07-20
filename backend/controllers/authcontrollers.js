import User from '../models/Authmodels.js';
import bcrypt from 'bcrypt';
import genToken from '../utils/genToken.js';
import validator from 'validator';
import sendEmail from '../utils/sendMail.js';
import * as crypto from 'crypto'; 
import { randomBytes, createHash } from "crypto";
// import cookieParser from 'cookie-parser';

const signup = async (req, res) => {

    const alloweduserTypes = ["candidate", "recruiter"];
    try {
        let { firstName, lastName, userName, email, password, userType, profileImage,
            headline,
            skills,
            education,
            location,
            experience,
            resume } = req.body;
        if (!firstName || !lastName || !userName || !email || !password || !userType) {
            return res.status(400).json({ message: "Backend:All fields are required" });
        }

        if (!alloweduserTypes.includes(userType)) {
            return res.status(400).json({ message: "Invalid user type" });
        }


        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }


        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }
        const existinguser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existinguser) {

            if (existinguser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existinguser.userName === userName) {
                return res.status(400).json({ message: "Username already taken" });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            userType,
            profileImage,
            headline,
            skills,
            education,
            location,
            experience,
            resume
        });
        let token = await genToken(newuser._id);
        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
             secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        // console.log("authcontrollers.js, signup route :New user created:", newuser);
        // removed password before sending to frontend(console),will be stored in the fetching result of signup api and will be used to set user data in frontend context    
        const userWithoutPassword = await User.findById(newuser._id).select("-password");
        // console.log("Signed-up User:", userWithoutPassword);
        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,//sending user data without password to frontend, since storing user data in frontend(UserDatacontext) after signup/login 
        });
        // res.redirect("/home");
    } catch (e) {
        console.error("SIGNUP ERROR:", e);
        res.status(500).json({

            message: "Signup failed",
            error: e.message,

        });
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        let existinguser = await User.findOne({ email });
        if (!existinguser) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }
        let isPasswordMatch = await bcrypt.compare(password, existinguser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }
        let token = await genToken(existinguser._id);
        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        // console.log("Logged-in User:", existinguser);
        res.status(200).json({
            message: "Login successful",
            user: existinguser,
        });
    } catch (e) {
        res.status(400).json({ message: "Login failed", error: e.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Logout successful",
        });
    } catch (e) {
        console.log("Error in logout controller: ", e.message);
        res.status(500).json({
            message: "Logout failed",
            error: e.message,
        });
    }
}



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        // Even if the email doesn't exist, return a 200 success message. This prevents hackers from guessing which emails are registered
        if (!user) {
            return res.status(200).json({
                message: "If an account matches that email, a password reset link has been sent."
            });
        }

        //generating random token string
        const rawResetToken = crypto.randomBytes(32).toString("hex");

        //Hashing the raw token and save it to the user's document
        user.resetPasswordToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 min

        await user.save({ validateBeforeSave: false });

        //dynamic reset link
        const resetUrl = `http://localhost:5173/reset-password/${rawResetToken}`;

        //html body for email
        const emailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #4f46e5;">Password Reset Request</h2>
                
                <p>You requested a password reset for your ApplyFlow account. Please click the button below to set up a new password. This link will expire in <strong>10 minutes</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it. Your password will remain completely secure.</p>
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px; text-align: center;">ApplyFlow Systems, India</p>
            </div>`;

        //firing off the email
        try {
            await sendEmail({
                email: user.email,
                subject: "ApplyFlow Password Recovery",
                message: emailBody,
            });
            return res.status(200).json({ message: "If an account matches that email address, a password reset link has been sent." });

        } catch (emailError) {
            // Clean up the database fields if the email fails to deliver completely
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            console.error("Email delivery failed:", emailError.message);
            return res.status(500).json({ message: "Email delivery system failed. Please try again later." });
        }

    } catch (e) {
        console.log("Error in forgotPassword controller", e.message);
        return res.status(500).json({ message: e.message });
    }
}




const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Please provide both password fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match. Please retype them carefully." });
        }


        //Hashing the raw token from the URL so it can match with db records
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means "greater than" current time
        });

        if (!user) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired. Please request a new link."
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password updated successfully! You can now log in with your new credentials."
        });

    } catch (e) {
        console.log("Error in resetPassword controller: ", e.message);
        return res.status(500).json({ message: "Server encountered an error resetting your password." });
    }
}




export { signup, login, logout, forgotPassword, resetPassword };
