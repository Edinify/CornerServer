import mongoose from "mongoose";

const Schema = mongoose.Schema;

const checkSchema = new Schema(
  {
    orders: {
      type: [
        {
          order: {
            type: Object,
          },
          orderCount: {
            type: Number,
          },
        },
      ],
    },
    sets: {
      type: [
        {
          set: {
            type: Object,
          },
          setCount: {
            type: Number,
          },
        },
      ],
    },
    table: {
      type: Object,
      required: true,
    },
    totalDate: {
      type: Number,
      required: true,
    },
    totalPayment: {
      type: Number,
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "confirmed", "cancelled"],
    },
  },
  { timestamps: true }
);

export const Check = mongoose.model("Check", checkSchema);
