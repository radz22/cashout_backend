import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model<IUser>("user", UserSchema);
