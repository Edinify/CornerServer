import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tableNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    oneMinutePrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tableSchema.index({tableNumber: 1})

export const Table = mongoose.model("Table", tableSchema);
