import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";
import { io, connectedUsers } from "../app.js";

export const acceptBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;

    // ✅ CORRECCIÓN: Popular también winner
    const product = await Product.findById(productId)
      .populate("currentBidder", "username email name")
      .populate("user", "username email name")
      .populate("winner", "username email name"); // ← Agregado

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.user._id.toString() !== sellerId) {
      return res.status(403).json({
        message: "No tienes permiso para aceptar pujas en este producto",
      });
    }

    if (product.estado !== "Activa") {
      return res.status(400).json({
        message: "Esta subasta ya no está activa",
      });
    }

    if (!product.currentBidder || product.totalBids === 0) {
      return res.status(400).json({
        message: "No hay pujas para aceptar en este producto",
      });
    }

    // ✅ Actualizar el producto
    product.estado = "Vendida";
    product.winner = product.currentBidder._id;
    product.finalPrice = product.currentPrice;
    await product.save();

    // ✅ CORRECCIÓN: Volver a popular después de guardar
    await product.populate("winner", "username email name");

    // Crear notificación para el ganador
    const winnerNotification = new Notification({
      recipient: product.currentBidder._id,
      sender: sellerId,
      product: productId,
      type: "auction_won",
      bidAmount: product.finalPrice,
      message: `¡Felicidades! Has ganado la subasta de "${
        product.title
      }" por $${product.finalPrice.toLocaleString()}`,
    });

    await winnerNotification.save();
    await winnerNotification.populate("sender", "username email");
    await winnerNotification.populate("product", "title image");

    // Enviar notificación en tiempo real
    const winnerSocketId = connectedUsers.get(
      product.currentBidder._id.toString()
    );
    if (winnerSocketId) {
      io.to(winnerSocketId).emit("new_notification", {
        notification: winnerNotification,
        type: "auction_won",
      });

      io.to(winnerSocketId).emit("auction_won", {
        productId: product._id,
        productTitle: product.title,
        finalPrice: product.finalPrice,
        message: "¡Felicidades! Has ganado esta subasta",
      });
    }

    // Notificar a todos
    io.emit("auction_closed", {
      productId: product._id,
      winnerId: product.winner,
      finalPrice: product.finalPrice,
      estado: "Vendida",
    });

    // ✅ CORRECCIÓN: Devolver toda la información del ganador
    res.json({
      message: "Puja aceptada exitosamente",
      product: {
        _id: product._id,
        title: product.title,
        estado: product.estado,
        winner: product.winner, // ← Ahora está populado correctamente
        finalPrice: product.finalPrice,
        winnerInfo: {
          id: product.winner._id,
          username: product.winner.username,
          email: product.winner.email,
          name: product.winner.name || product.winner.username
        },
      },
    });
  } catch (error) {
    console.error("Error al aceptar puja:", error);
    res.status(500).json({
      message: "Error al aceptar la puja",
      error: error.message,
    });
  }
};
export const cancelAuction = async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason } = req.body;
    const sellerId = req.user.id;

    const product = await Product.findById(productId)
      .populate("currentBidder", "username email")
      .populate("user", "username email");

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.user._id.toString() !== sellerId) {
      return res.status(403).json({
        message: "No tienes permiso para cancelar esta subasta",
      });
    }

    if (product.estado !== "Activa") {
      return res.status(400).json({
        message: "Esta subasta ya no está activa",
      });
    }

    // Actualizar estado
    product.estado = "Cancelada";
    await product.save();

    // Si había un postor actual, notificarle
    if (product.currentBidder) {
      const cancellationNotification = new Notification({
        recipient: product.currentBidder._id,
        sender: sellerId,
        product: productId,
        type: "auction_end",
        bidAmount: product.currentPrice,
        message: `La subasta de "${product.title}" ha sido cancelada. ${
          reason ? "Motivo: " + reason : ""
        }`,
      });

      await cancellationNotification.save();
      await cancellationNotification.populate("sender", "username email");
      await cancellationNotification.populate("product", "title image");

      const bidderSocketId = connectedUsers.get(
        product.currentBidder._id.toString()
      );
      if (bidderSocketId) {
        io.to(bidderSocketId).emit("new_notification", {
          notification: cancellationNotification,
          type: "auction_end",
        });
      }
    }

    // Notificar a todos que la subasta se canceló
    io.emit("auction_closed", {
      productId: product._id,
      estado: "Cancelada",
      reason: reason || "Cancelada por el vendedor",
    });

    res.json({
      message: "Subasta cancelada exitosamente",
      product: {
        _id: product._id,
        title: product.title,
        estado: product.estado,
      },
    });
  } catch (error) {
    console.error("Error al cancelar subasta:", error);
    res.status(500).json({
      message: "Error al cancelar la subasta",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    console.log("📡 [getProducts] Obteniendo TODOS los productos...");

    const products = await Product.find()
      .populate("user", "username email name")
      .populate("currentBidder", "username email name")
      .populate("winner", "username email name"); // ← Agregado

    console.log(`✅ [getProducts] Encontrados ${products.length} productos`);
    res.json(products);
  } catch (error) {
    console.error("❌ [getProducts] Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    console.log(
      "📡 [getMyProducts] Obteniendo productos del usuario:",
      req.user.id
    );

    const products = await Product.find({
      user: req.user.id,
    })
      .populate("user", "username email name")
      .populate("currentBidder", "username email name")
      .populate("winner", "username email name"); // ← Agregado

    console.log(
      `✅ [getMyProducts] Encontrados ${products.length} productos del usuario`
    );
    res.json(products);
  } catch (error) {
    console.error("❌ [getMyProducts] Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      startingPrice,
      dateStart,
      dateEnd,
      user,
    } = req.body;

    const newProduct = new Product({
      title,
      description,
      image,
      category,
      startingPrice,
      dateStart,
      dateEnd,
      user: req.user.id,
    });
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user", "username email name")
      .populate("currentBidder", "username email name")
      .populate("winner", "username email name"); // ← Agregado

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    return res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ message: "Product not found" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    return res.status(404).json({ message: "Product not found" });
  }
};

export const getProductsWithFilters = async (req, res) => {
  try {
    console.log(
      "🔍 [getProductsWithFilters] Query params recibidos:",
      req.query
    );

    const {
      search,
      category,
      estado,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 100,
    } = req.query;

    let query = {};
    const now = new Date();

    // ... (tu lógica de filtros aquí)

    const sortOptions = {
      createdAt: { createdAt: sortOrder === "asc" ? 1 : -1 },
      price: { currentPrice: sortOrder === "asc" ? 1 : -1 },
      dateEnd: { dateEnd: sortOrder === "asc" ? 1 : -1 },
      totalBids: { totalBids: sortOrder === "asc" ? 1 : -1 },
      popular: { totalBids: -1, currentPrice: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.createdAt;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("user", "username email name")
      .populate("currentBidder", "username name")
      .populate("winner", "username email name") // ← Agregado
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("❌ [getProductsWithFilters] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};
export const searchByFeatures = async (req, res) => {
  try {
    const { features } = req.query;

    if (!features) {
      return res
        .status(400)
        .json({ message: "Se requiere al menos una característica" });
    }

    const featuresList = features.split(",").map((f) => f.trim());

    // $all: Debe tener TODAS las características
    const productsAll = await Product.find({
      features: { $all: featuresList },
      estado: "Activa",
    }).limit(10);

    // $in: Debe tener AL MENOS UNA de las características
    const productsAny = await Product.find({
      features: { $in: featuresList.map((f) => new RegExp(f, "i")) },
      estado: "Activa",
    }).limit(10);

    res.json({
      matchesAll: productsAll,
      matchesAny: productsAny,
    });
  } catch (error) {
    console.error("Error en búsqueda por características:", error);
    res.status(500).json({ message: "Error en la búsqueda" });
  }
};

export const getEndingSoon = async (req, res) => {
  try {
    const hours = Number(req.query.hours) || 24;
    const now = new Date();
    const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const products = await Product.find({
      estado: "Activa",
      dateEnd: {
        $gt: now,
        $lt: futureDate,
      },
    })
      .sort({ dateEnd: 1 })
      .limit(10)
      .populate("user", "username")
      .populate("currentBidder", "username");

    res.json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error al obtener subastas" });
  }
};

export const getBargains = async (req, res) => {
  try {
    const products = await Product.find({
      estado: "Activa",
      $or: [
        { totalBids: { $lte: 2 } }, // Pocas pujas
        { currentPrice: { $lt: 500000 } }, // Precio bajo
      ],
    })
      .sort({ currentPrice: 1 }) // Menor precio primero
      .limit(10)
      .populate("user", "username");

    res.json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error al obtener gangas" });
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Buscar productos similares
    const similar = await Product.find({
      _id: { $ne: productId }, // $ne: Not equal (excluir el producto actual)
      category: product.category,
      estado: "Activa",
      currentPrice: {
        $gte: product.currentPrice * 0.7, // 70% del precio
        $lte: product.currentPrice * 1.3, // 130% del precio
      },
    })
      .limit(6)
      .populate("user", "username");

    res.json(similar);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error al obtener productos similares" });
  }
};
