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
    currentPrice: {
      type: Number,
      default: function() {
        return this.startingPrice; 
      },
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
    estado: {
      type: String,
      enum: ['Activa', 'Finalizada', 'Cancelada', 'Vendida'],
      default: 'Activa'
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    finalPrice: {
      type: Number,
      default: null
    },
    category: {
      type: String,
    },
    moneda: {
      type: String,
      default: 'COP'
    },
    location: {
      type: String,
      default: 'Colombia'
    },
    features: [{
      type: String
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    totalBids: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true, 
  }
);
productSchema.index({ user: 1, estado: 1 });
productSchema.index({ dateEnd: 1, estado: 1 });
productSchema.index({ category: 1 });

export default mongoose.model("Product", productSchema);