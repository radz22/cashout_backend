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
      const findUserName = user.username;
      return res.status(200).send({ username: findUserName });
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);
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
        email: email,
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
      const find_user_id = find_username?._id;
      const isPasswordValid = await bcrypt.compare(password, storedPassword);

      if (isPasswordValid) {
        const token = generateToken({ username: find_username.username });

        return res
          .status(200)
          .send({ token: token, userid: find_user_id, login: "true" });
      } else {
        throw new NotFoundError("Invalid username or password");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

userRoutes.post(
  "/checking",
  async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const existingUser = await userModel.findOne({
        email: email,
      });

      if (!existingUser) {
        return res.status(201).send({ user: "user not exist" });
      } else {
        throw new NotFoundError("user Exist");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

export default userRoutes;
