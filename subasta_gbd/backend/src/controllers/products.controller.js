import Product from "../models/product.model.js";

// 🛒 MODIFICADO - Para COMPRADORES (todos los productos)
export const getProducts = async (req, res) => {
  try {
    console.log('📡 [getProducts] Obteniendo TODOS los productos...');
    
    // SIN FILTRO - trae todos los productos
    const products = await Product.find().populate("user");
    
    console.log(`✅ [getProducts] Encontrados ${products.length} productos`);
    res.json(products);
  } catch (error) {
    console.error('❌ [getProducts] Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// 👤 NUEVO - Para VENDEDORES (solo mis productos)
export const getMyProducts = async (req, res) => {
  try {
    console.log('📡 [getMyProducts] Obteniendo productos del usuario:', req.user.id);
    
    // CON FILTRO - solo productos del usuario logueado
    const products = await Product.find({
      user: req.user.id,
    }).populate("user");
    
    console.log(`✅ [getMyProducts] Encontrados ${products.length} productos del usuario`);
    res.json(products);
  } catch (error) {
    console.error('❌ [getMyProducts] Error:', error);
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