import express, { Request, Response, NextFunction } from "express";
import { signUpTypes } from "../types/signupType";
import { userModel } from "../db/userSchema";
import bcrypt from "bcrypt";
import { ApiError } from "../hooks/custom_error/customError";
import { Unauthorized } from "../hooks/custom_error/customError";
import { NotFoundError } from "../hooks/custom_error/customError";
import { generateToken, verifyToken } from "../services/jsonwebtoken";
const userRoutes = express.Router();
const saltRound = 10;

userRoutes.post(
  "/signup",
  async (
    req: Request<{}, {}, signUpTypes>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const hash = await bcrypt.genSalt(saltRound);

      const { email, username, password } = req.body;
      const existingUser = await userModel.findOne({
        $or: [{ email }, { username }],
      });

      if (!existingUser) {
        const data = {
          email: email,
          username: username,
          password: await bcrypt.hash(password, hash),
        };

        const create_user = await userModel.create(data);
        if (create_user) {
          return res.status(201).send({ create: create_user });
        }
      } else {
        throw new NotFoundError("user Exist");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

userRoutes.post(
  "/signin",
  async (
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username, password } = req.body;

      const find_username = await userModel.findOne({ username: username });

      if (!find_username) {
        throw new NotFoundError("Invalid username or password");
      }

      const storedPassword = find_username.password;

      const isPasswordValid = await bcrypt.compare(password, storedPassword);

      if (isPasswordValid) {
        const token = generateToken({ username: find_username.username });

        return res.status(200).send({ token: token });
      } else {
        throw new NotFoundError("Invalid username or password");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

userRoutes.get(
  "/getUserData/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      if (!token) {
        throw new NotFoundError("token not found");
      }

      const decoded = verifyToken(token);

      if (!decoded || !decoded.username) {
        throw new Unauthorized("Invalid token"); // Use 401 Unauthorized for invalid token
      }

      const user = await userModel.findOne({ username: decoded.username });

      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.status(200).send({ data: user });
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

export default userRoutes;
