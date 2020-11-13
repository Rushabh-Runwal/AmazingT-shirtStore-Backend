const Product = require("../models/product");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: `Product not found in DB, ${err}`,
        });
      }
      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtentions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: `Problem with the file ${err}`,
      });
    }

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please enter all the fields",
      });
    }

    let product = new Product(fields);

    //   handle file here
    if (file.photo) {
      if (file.photo.size > 1024 * 1024 * 3) {
        return res.status(400).json({
          error: "Failed, see file size should be less than 3 MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //    save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(product);
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtentions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with the file",
        e: err,
      });
    }
    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //   handle file here
    if (file.photo) {
      if (file.photo.size > 1024 * 1024 * 3) {
        return res.status(400).json({
          error: "Updation of product failed",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //    save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deleted_product) => {
    if (err) {
      return res.status(400).json({
        message: "Deletion aws unsucceesful",
        error: err,
      });
    }
    res.json({
      message: "Deletion was successfully",
      deleteProduct: deleted_product,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find({})
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, allproducts) => {
      if (err) {
        return res.status(400).json({
          error: "No Product found",
        });
      }
      res.json(allproducts);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        message: "no categories found",
        error: err,
      });
    }
    res.json(category);
  });
};

exports.UpdateStockAndSold = (req, res, next) => {
  let updateStockAndSold = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(updateStockAndSold, {}, (err, products) => {
    if (err) {
      res.status(400).json({
        error: "BULK operation failed",
      });
    }
  });

  next();
};
