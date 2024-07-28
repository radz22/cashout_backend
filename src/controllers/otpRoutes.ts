import express, { Request, Response, NextFunction } from "express";
import { ApiError, NotFoundError } from "../hooks/custom_error/customError";
import { sendEmail } from "../services/nodeMailer";
import "dotenv/config";

const otpRoutes = express.Router();

function generateRandomSixDigits() {
  // Generate a random number between 100000 and 999999 (inclusive)
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber;
}

otpRoutes.post(
  "/otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username } = req.body;
      const randomOTP = generateRandomSixDigits();
      const fromEmail = process.env.EMAIL;
      if (!fromEmail) {
        throw new NotFoundError("Email environment variable is not defined");
      }
      const mailOptions = {
        from: fromEmail,
        to: email,
        subject: "OTP FOR CREATING ACCOUNT",
        text: `Hello ${username}

            Your OTP : ${randomOTP}`,
      };

      const sendDataEmail = await sendEmail(mailOptions);

      if (sendDataEmail) {
        return res.status(200).send({ otp: randomOTP });
      } else {
        throw new NotFoundError("invalid");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

export default otpRoutes;
