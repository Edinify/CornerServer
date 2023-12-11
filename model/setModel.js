import mongoose from "mongoose";

const Schema = mongoose.Schema;

const setSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Base",
        },
        productCount: {
          type: Number,
          required: true,
        },
        productUnitAmount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Set = mongoose.model("Set", setSchema);
