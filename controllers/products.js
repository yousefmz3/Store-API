const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort("-name price");
  res.status(200).json({ products , nbHits : products.length });
};

const getAllProducts = async (req, res) => {
  const { featured , company , name , sort } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  console.log(queryObject);
  let result = Product.find(queryObject);
  if (sort) {
    const sortObj = {};
    sort.split(/[,\s]+/).forEach(item => {
      if (!item) return; 
      item = item.trim();
      sortObj[item.startsWith("-") ? item.slice(1) : item] = item.startsWith("-") ? -1 : 1;
    });
    console.log(sortObj);
    result = result.sort(sortObj);
  } else {
    result = result.sort({createdAt : 1});
  }
  const products = await result;
  res.status(200).json({ products, nbHits : products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
