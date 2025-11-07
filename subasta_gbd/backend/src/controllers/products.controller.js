import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";
import { io, connectedUsers } from "../app.js";

export const acceptBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id; // ID del vendedor que está aceptando

    // Buscar el producto
    const product = await Product.findById(productId)
      .populate("currentBidder", "username email")
      .populate("user", "username email");

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar que el usuario sea el dueño del producto
    if (product.user._id.toString() !== sellerId) {
      return res.status(403).json({
        message: "No tienes permiso para aceptar pujas en este producto",
      });
    }

    // Verificar que la subasta esté activa
    if (product.estado !== "Activa") {
      return res.status(400).json({
        message: "Esta subasta ya no está activa",
      });
    }

    // Verificar que haya al menos una puja
    if (!product.currentBidder || product.totalBids === 0) {
      return res.status(400).json({
        message: "No hay pujas para aceptar en este producto",
      });
    }

    // Actualizar el producto
    product.estado = "Vendida";
    product.winner = product.currentBidder._id;
    product.finalPrice = product.currentPrice;
    await product.save();

    // 🎉 CREAR NOTIFICACIÓN PARA EL GANADOR
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

    // 🔔 ENVIAR NOTIFICACIÓN EN TIEMPO REAL AL GANADOR
    const winnerSocketId = connectedUsers.get(
      product.currentBidder._id.toString()
    );
    if (winnerSocketId) {
      io.to(winnerSocketId).emit("new_notification", {
        notification: winnerNotification,
        type: "auction_won",
      });

      // También enviar evento específico de victoria
      io.to(winnerSocketId).emit("auction_won", {
        productId: product._id,
        productTitle: product.title,
        finalPrice: product.finalPrice,
        message: "¡Felicidades! Has ganado esta subasta",
      });
    }

    // 📢 NOTIFICAR A TODOS LOS DEMÁS PARTICIPANTES QUE LA SUBASTA TERMINÓ
    io.emit("auction_closed", {
      productId: product._id,
      winnerId: product.winner,
      finalPrice: product.finalPrice,
      estado: "Vendida",
    });

    res.json({
      message: "Puja aceptada exitosamente",
      product: {
        _id: product._id,
        title: product.title,
        estado: product.estado,
        winner: product.winner,
        finalPrice: product.finalPrice,
        winnerInfo: {
          username: product.currentBidder.username,
          email: product.currentBidder.email,
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
    console.log(" [getProducts] Obteniendo TODOS los productos...");

    // SIN FILTRO - trae todos los productos
    const products = await Product.find().populate("user");

    console.log(` [getProducts] Encontrados ${products.length} productos`);
    res.json(products);
  } catch (error) {
    console.error(" [getProducts] Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    console.log(
      "📡 [getMyProducts] Obteniendo productos del usuario:",
      req.user.id
    );

    // CON FILTRO - solo productos del usuario logueado
    const products = await Product.find({
      user: req.user.id,
    }).populate("user");

    console.log(
      ` [getMyProducts] Encontrados ${products.length} productos del usuario`
    );
    res.json(products);
  } catch (error) {
    console.error(" [getMyProducts] Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      startingPrice,
      dateStart,
      dateEnd,
      user,
    } = req.body;

    const newProduct = new Product({
      title,
      description,
      image,
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
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
      bargain,
      hot,
      withBids,
    } = req.query;

    let query = {};
    const now = new Date();

    query.dateEnd = { $gt: now };
    console.log(" Filtrando productos no expirados");

    if (estado && estado.trim() !== "" && estado !== "all") {
      const estados = estado.split(",").map((e) => e.trim());
      query.estado = { $in: estados };
      console.log(" Filtro estado explícito del usuario:", estados);
    } else {
      query.estado = "Activa";
      console.log(
        " Estado por defecto: Activa (excluyendo Vendida y Cancelada)"
      );
    }

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      const searchRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { features: { $elemMatch: { $regex: searchRegex } } },
      ];

      console.log("🔍 Búsqueda por texto:", searchTerm);
      console.log("🔍 Buscando en: title, description, category, features");
    }

    if (
      category &&
      category.trim() !== "" &&
      category !== "all" &&
      category !== "todos"
    ) {
      const categories = category.split(",").map((c) => c.trim().toLowerCase());
      const categoryRegexes = categories.map(
        (cat) => new RegExp(`^${cat}$`, "i")
      );
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { category: { $in: categoryRegexes } },
        ];
        delete query.$or;
      } else {
        query.category = { $in: categoryRegexes };
      }

      console.log(" Filtro categoría (case-insensitive):", categories);
      console.log(" Regex generados:", categoryRegexes);
    }

    if (minPrice || maxPrice) {
      query.currentPrice = {};
      if (minPrice && minPrice !== "") {
        query.currentPrice.$gte = Number(minPrice);
        console.log(" Precio mínimo:", minPrice);
      }
      if (maxPrice && maxPrice !== "") {
        query.currentPrice.$lte = Number(maxPrice);
        console.log("Precio máximo:", maxPrice);
      }
    }

    const sortOptions = {
      createdAt: { createdAt: sortOrder === "asc" ? 1 : -1 },
      price: { currentPrice: sortOrder === "asc" ? 1 : -1 },
      dateEnd: { dateEnd: sortOrder === "asc" ? 1 : -1 },
      totalBids: { totalBids: sortOrder === "asc" ? 1 : -1 },
      popular: { totalBids: -1, currentPrice: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.createdAt;
    console.log("🔀 Ordenamiento:", sort);

    const skip = (page - 1) * limit;



    const products = await Product.find(query)
      .populate("user", "username email")
      .populate("currentBidder", "username")
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    console.log(
      ` [getProductsWithFilters] Encontrados ${products.length} de ${total} productos`
    );

    if (products.length > 0) {
      console.log("Primeros productos encontrados:");
      products.slice(0, 3).forEach((p) => {
        console.log(
          `  - ${p.title} | Estado: ${p.estado} | Precio: $${p.currentPrice}`
        );
      });
    } else {
      console.log("No se encontraron productos con este query");

      const totalActivos = await Product.countDocuments({
        estado: "Activa",
        dateEnd: { $gt: now },
      });
      console.log(
        ` Total de productos activos no expirados: ${totalActivos}`
      );

      if (search) {
       
        const byTitle = await Product.countDocuments({
          title: new RegExp(search, "i"),
          dateEnd: { $gt: now },
        });
        console.log(`🔍 Productos que coinciden solo por título: ${byTitle}`);
      }
    }

    let stats = null;
    if (products.length > 0) {
      const statsResult = await Product.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$currentPrice" },
            minPrice: { $min: "$currentPrice" },
            maxPrice: { $max: "$currentPrice" },
            totalProducts: { $sum: 1 },
          },
        },
      ]);
      stats = statsResult[0] || null;
    }
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
      stats,
      filters: {
        search,
        category,
        estado,
        minPrice,
        maxPrice,
        location,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error(" [getProductsWithFilters] Error:", error);
    console.error("Stack trace:", error.stack);

    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message,
      products: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 100,
        pages: 0,
        hasMore: false,
      },
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
