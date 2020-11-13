const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", " name price")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "No order was found in the DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order in DB ",
        e: err,
      });
    }
  });
};

exports.getAllOrders = (req, res) => {
  Order.find({})
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in Db",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body._id },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        res.status(400).json({
          error: "Cannot Update your Order",
        });
      }
      res.json(order);
    }
  );
};
