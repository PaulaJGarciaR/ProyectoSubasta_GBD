import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
     const products = await Product.find({
    user: req.user.id,
  }).populate("user");
  res.json(products);
  } catch (error) {
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
