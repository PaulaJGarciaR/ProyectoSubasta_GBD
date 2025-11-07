// backend/controllers/wins.controller.js
import Product from '../models/product.model.js';
import Bid from '../models/bid.model.js';

// 🏆 Obtener todas las subastas ganadas por el usuario actual
export const getMyWins = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar productos donde el usuario es el ganador
    const wonProducts = await Product.find({
      winner: userId,
      estado: 'Vendida'
    })
    .populate('user', 'username email')  // Datos del vendedor
    .populate('winner', 'username email') // Datos del ganador (tú)
    .sort({ updatedAt: -1 }) // Más recientes primero
    .lean();

    // Para cada producto ganado, obtener detalles de la puja ganadora
    const winsWithBidDetails = await Promise.all(
      wonProducts.map(async (product) => {
        // Buscar la última puja del usuario en este producto
        const winningBid = await Bid.findOne({
          product: product._id,
          bidder: userId,
          amount: product.finalPrice
        })
        .populate('bidder', 'username email')
        .sort({ createdAt: -1 });

        // Contar total de pujas que hizo en este producto
        const totalBidsOnProduct = await Bid.countDocuments({
          product: product._id,
          bidder: userId
        });

        return {
          ...product,
          winningBid,
          myTotalBids: totalBidsOnProduct,
          wonDate: product.updatedAt
        };
      })
    );

    res.json({
      success: true,
      wins: winsWithBidDetails,
      total: winsWithBidDetails.length
    });

  } catch (error) {
    console.error('Error al obtener subastas ganadas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener subastas ganadas',
      error: error.message 
    });
  }
};

// 🏆 Obtener estadísticas de victorias
export const getWinStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total de victorias
    const totalWins = await Product.countDocuments({
      winner: userId,
      estado: 'Vendida'
    });

    // Total gastado en victorias
    const winsWithPrices = await Product.find({
      winner: userId,
      estado: 'Vendida'
    }).select('finalPrice');

    const totalSpent = winsWithPrices.reduce((sum, product) => {
      return sum + (product.finalPrice || 0);
    }, 0);

    // Precio promedio de victorias
    const avgPrice = totalWins > 0 ? totalSpent / totalWins : 0;

    // Victoria más cara
    const mostExpensive = await Product.findOne({
      winner: userId,
      estado: 'Vendida'
    })
    .sort({ finalPrice: -1 })
    .populate('user', 'username')
    .lean();

    // Victoria más barata
    const cheapest = await Product.findOne({
      winner: userId,
      estado: 'Vendida'
    })
    .sort({ finalPrice: 1 })
    .populate('user', 'username')
    .lean();

    // Categorías más ganadas
    const categoryStats = await Product.aggregate([
      { 
        $match: { 
          winner: userId,
          estado: 'Vendida'
        } 
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSpent: { $sum: '$finalPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Total de pujas realizadas (no solo las ganadoras)
    const totalBidsPlaced = await Bid.countDocuments({
      bidder: userId
    });

    // Tasa de éxito (victorias / total de subastas en las que participó)
    const participatedAuctions = await Bid.distinct('product', { bidder: userId });
    const successRate = participatedAuctions.length > 0 
      ? (totalWins / participatedAuctions.length * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      stats: {
        totalWins,
        totalSpent,
        avgPrice,
        mostExpensive,
        cheapest,
        categoryStats,
        totalBidsPlaced,
        participatedAuctions: participatedAuctions.length,
        successRate: `${successRate}%`
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

// 🏆 Obtener detalle completo de una victoria específica
export const getWinDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findOne({
      _id: productId,
      winner: userId,
      estado: 'Vendida'
    })
    .populate('user', 'username email')
    .populate('winner', 'username email')
    .lean();

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Subasta ganada no encontrada' 
      });
    }

    // Todas las pujas del usuario en este producto
    const myBids = await Bid.find({
      product: productId,
      bidder: userId
    })
    .sort({ createdAt: -1 })
    .lean();

    // Historial completo de pujas del producto
    const allBids = await Bid.find({ product: productId })
    .populate('bidder', 'username')
    .sort({ createdAt: -1 })
    .lean();

    res.json({
      success: true,
      product,
      myBids,
      allBids,
      bidStats: {
        totalBidsOnProduct: allBids.length,
        myTotalBids: myBids.length,
        uniqueBidders: [...new Set(allBids.map(b => b.bidder._id.toString()))].length
      }
    });

  } catch (error) {
    console.error('Error al obtener detalles:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener detalles',
      error: error.message 
    });
  }
};