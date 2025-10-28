// models/bid.model.js
import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para consultas rápidas
bidSchema.index({ product: 1, createdAt: -1 });
bidSchema.index({ bidder: 1, createdAt: -1 });

export default mongoose.model('Bid', bidSchema);