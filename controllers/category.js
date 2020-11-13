const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, categ) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = categ;
  });
  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, categ) => {
    if (err) {
      return res.status(400).json({
        error: "error while creating Category ",
        message: err,
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(res.category);
};

exports.getALLCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res, id) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res, id) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: `${category} was successfully deleted `,
    });
  });
};
