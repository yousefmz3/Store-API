const { filter } = require("lodash");
const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $lt: 50 } })
    .select("name price")
    .limit(5)
    .skip(1);
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

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

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /(>=|<=|>|<|=)/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);

    const options = ["price", "rating"];

    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-").map((element) => element.trim());
      
      if (options.includes(field)) {
        queryObject[field] = {
          ...queryObject[field],
          [operator]: Number(value),
        };
        console.log(queryObject);
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject);

  if (sort) {
    const sortObj = {};
    sort.split(/[,\s]+/).forEach((item) => {
      if (!item) return;
      item = item.trim();
      sortObj[item.startsWith("-") ? item.slice(1) : item] = item.startsWith(
        "-",
      )
        ? -1
        : 1;
    });
    console.log(sortObj);
    result = result.sort(sortObj);
  } else {
    result = result.sort({ createdAt: 1 });
  }

  if (fields) {
    const fieldsObj = {};
    fields.split(/[,\s]+/).forEach((item) => {
      if (!item) return;
      item = item.trim();
      fieldsObj[item] = 1;
    });
    console.log(fieldsObj);
    result = result.select(fieldsObj);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
