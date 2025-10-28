// controllers/bids.controller.js
import Bid from '../models/bid.model.js';
import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';
import { io, connectedUsers } from '../app.js';

export const createBid = async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const bidderId = req.user.id;

    // Validar que el producto existe
    const product = await Product.findById(productId).populate('user');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Validar que la subasta está activa
    if (product.estado !== 'Activa') {
      return res.status(400).json({ message: 'Esta subasta no está activa' });
    }

    // Validar que no ha expirado
    if (new Date() > new Date(product.dateEnd)) {
      return res.status(400).json({ message: 'Esta subasta ha finalizado' });
    }

    // Validar que el comprador no es el vendedor
    if (product.user._id.toString() === bidderId) {
      return res.status(400).json({ message: 'No puedes pujar en tu propio producto' });
    }

    // Validar que la puja es mayor al precio actual
    if (amount <= product.currentPrice) {
      return res.status(400).json({ 
        message: `La puja debe ser mayor a $${product.currentPrice.toLocaleString()}` 
      });
    }

    // Guardar el anterior mejor postor
    const previousBidder = product.currentBidder;

    // Crear la puja
    const newBid = new Bid({
      product: productId,
      bidder: bidderId,
      amount
    });

    await newBid.save();

    // Actualizar el producto
    product.currentPrice = amount;
    product.currentBidder = bidderId;
    product.totalBids += 1;
    await product.save();

    // Poblar información del comprador para las notificaciones
    await newBid.populate('bidder', 'username email');

    // 1. Notificar al VENDEDOR
    const sellerNotification = new Notification({
      recipient: product.user._id,
      sender: bidderId,
      product: productId,
      type: 'new_bid',
      bidAmount: amount,
      message: `${newBid.bidder.username || 'Un usuario'} ha pujado $${amount.toLocaleString()} en tu producto "${product.title}"`
    });

    await sellerNotification.save();
    await sellerNotification.populate('sender', 'username email');
    await sellerNotification.populate('product', 'title image');

    // Enviar notificación en tiempo real al vendedor
    const sellerSocketId = connectedUsers.get(product.user._id.toString());
    if (sellerSocketId) {
      io.to(sellerSocketId).emit('new_notification', {
        notification: sellerNotification,
        type: 'new_bid'
      });
    }

    // 2. Notificar al ANTERIOR MEJOR POSTOR (si existe)
    if (previousBidder && previousBidder.toString() !== bidderId) {
      const outbidNotification = new Notification({
        recipient: previousBidder,
        sender: bidderId,
        product: productId,
        type: 'outbid',
        bidAmount: amount,
        message: `Has sido superado en "${product.title}". La nueva puja es $${amount.toLocaleString()}`
      });

      await outbidNotification.save();
      await outbidNotification.populate('sender', 'username email');
      await outbidNotification.populate('product', 'title image');

      // Enviar notificación en tiempo real al anterior postor
      const previousBidderSocketId = connectedUsers.get(previousBidder.toString());
      if (previousBidderSocketId) {
        io.to(previousBidderSocketId).emit('new_notification', {
          notification: outbidNotification,
          type: 'outbid'
        });
      }
    }

    // 3. Emitir actualización del producto a todos los usuarios conectados
    io.emit('product_updated', {
      productId: product._id,
      currentPrice: product.currentPrice,
      totalBids: product.totalBids
    });

    res.status(201).json({
      message: 'Puja realizada exitosamente',
      bid: newBid,
      product: {
        _id: product._id,
        currentPrice: product.currentPrice,
        totalBids: product.totalBids
      }
    });

  } catch (error) {
    console.error('Error al crear puja:', error);
    res.status(500).json({ message: 'Error al procesar la puja', error: error.message });
  }
};

export const getBidsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const bids = await Bid.find({ product: productId })
      .populate('bidder', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(bids);
  } catch (error) {
    console.error('Error al obtener pujas:', error);
    res.status(500).json({ message: 'Error al obtener pujas' });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bids = await Bid.find({ bidder: userId })
      .populate('product', 'title image currentPrice dateEnd estado')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Error al obtener mis pujas:', error);
    res.status(500).json({ message: 'Error al obtener pujas' });
  }
};