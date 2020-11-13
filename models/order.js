const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartProductSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "Products" },
  Count: { type: Number },
  name: String,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", CartProductSchema);

const CartSchema = new mongoose.Schema(
  {
    products: [CartProductSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Deliverded", "Shipped", "Processsed", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", CartSchema);

module.exports = { Order, ProductCart };
