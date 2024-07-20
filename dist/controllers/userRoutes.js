"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSchema_1 = require("../db/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRoutes = express_1.default.Router();
const saltRound = 10;
userRoutes.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt_1.default.genSalt(saltRound);
        const { email, username, password } = req.body;
        const find_email_and_username = yield userSchema_1.userModel.find({
            email: email,
            username: username,
        });
        if (!find_email_and_username) {
            const data = {
                email: email,
                username: username,
                password: yield bcrypt_1.default.hash(password, hash),
            };
            const create_user = yield userSchema_1.userModel.create(data);
            return res.status(201).send({ msg: create_user });
        }
        if (find_email_and_username) {
            // throw new NotFoundError("user exist");
        }
    }
    catch (error) {
        //   next(error);
        //   throw new ApiError("");
    }
}));
exports.default = userRoutes;
