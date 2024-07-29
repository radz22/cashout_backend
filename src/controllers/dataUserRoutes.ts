import express, { Request, Response, NextFunction } from "express";
import { dataUserType } from "../types/dataUserType";
import { NotFoundError } from "../hooks/custom_error/customError";
import { ApiError } from "../hooks/custom_error/customError";
import { dataUserModel } from "../db/dataUserSchema";
const dataUserRoutes = express.Router();

dataUserRoutes.post(
  "/create",
  async (
    req: Request<{}, {}, dataUserType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userid, date, amount, referrence, month, year } = req.body;

      const findReferrence = await dataUserModel.findOne({
        referrence: referrence,
      });

      if (!findReferrence) {
        const data = {
          userid,

          date,
          amount,
          referrence,
          month,
          year,
        };
        const dataCreate = await dataUserModel.create(data);
        if (dataCreate) {
          return res.status(201).send({ create: dataCreate });
        }
      } else {
        throw new NotFoundError("referrence exist");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

dataUserRoutes.get(
  "/fetchUserData/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const findById = await dataUserModel.find({ userid: id });
      if (findById) {
        return res.status(200).send(findById);
      } else {
        throw new NotFoundError("not found");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

dataUserRoutes.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const deleteData = await dataUserModel.findByIdAndDelete({ _id: id });
      if (!deleteData) {
        throw new NotFoundError("data not Delete");
      }
      return res.status(200).send({ msg: "Deleted" });
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

dataUserRoutes.put(
  "/edit/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, referrence, date } = req.body;
      const findAndUpdate = await dataUserModel.findByIdAndUpdate(
        { _id: id },
        { amount: amount, referrence: referrence, date: date }
      );
      if (!findAndUpdate) {
        throw new NotFoundError("data not not delete");
      }
      return res.status(200).send({ msg: findAndUpdate });
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);
dataUserRoutes.get(
  "/fetchdata1by1/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const findById = await dataUserModel.findById({ _id: id });
      if (findById) {
        return res.status(200).send(findById);
      } else {
        throw new NotFoundError("not found");
      }
    } catch (error) {
      next(error);
      throw new ApiError("");
    }
  }
);

export default dataUserRoutes;
