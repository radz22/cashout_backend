import mongoose, { Document, Schema } from "mongoose";
interface dataUserTypeMongoose extends Document {
  userid: string;
  date: string;
  amount: number;
  referrence: string;
  month: string;
  year: string;
}

const dataUserSchema: Schema = new Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    referrence: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const dataUserModel = mongoose.model<dataUserTypeMongoose>(
  "datauser",
  dataUserSchema
);
