const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort({ price: -1 });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "products testing route" });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
