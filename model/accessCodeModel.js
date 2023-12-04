import mongoose from "mongoose";

const Schema = mongoose.Schema;

const accessCodeSchema = new Schema(
  {
    accessCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export const AccessCode = mongoose.model("AccessCode", accessCodeSchema);
