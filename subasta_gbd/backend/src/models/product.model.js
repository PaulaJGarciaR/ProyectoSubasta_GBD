// backend/models/product.model.js
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
    // ⭐ NUEVO: Precio actual de la subasta (se actualiza con cada puja)
    currentPrice: {
      type: Number,
      default: function() {
        return this.startingPrice; // Empieza con el precio inicial
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
    // ⭐ NUEVO: Estado de la subasta
    estado: {
      type: String,
      enum: ['Activa', 'Finalizada', 'Cancelada'],
      default: 'Activa'
    },
    // ⭐ NUEVO: Categoría del producto
    category: {
      type: String,
      default: 'general'
    },
    // ⭐ NUEVO: Moneda
    moneda: {
      type: String,
      default: 'COP'
    },
    // ⭐ NUEVO: Ubicación
    location: {
      type: String,
      default: 'Colombia'
    },
    // ⭐ NUEVO: Características del producto
    features: [{
      type: String
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ⭐ NUEVO: Usuario con la puja más alta actual
    currentBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // ⭐ NUEVO: Contador total de pujas
    totalBids: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true, 
  }
);

// Índices para consultas rápidas
productSchema.index({ user: 1, estado: 1 });
productSchema.index({ dateEnd: 1, estado: 1 });
productSchema.index({ category: 1 });

export default mongoose.model("Product", productSchema);