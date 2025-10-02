import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, 
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Product", productSchema);