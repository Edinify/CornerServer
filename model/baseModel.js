import mongoose from "mongoose";

const Schema = mongoose.Schema;

const baseSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    unitMeasure: {
      type: String,
      enum: ["litr", "ədəd", "kq"],
    },
  },
  { timestamps: true }
);

export const Base = mongoose.model("Base", baseSchema);
