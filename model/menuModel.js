import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menuSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      default: "admin",
    },
    unitAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.model("Menu", menuSchema);
