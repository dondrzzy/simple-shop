const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 1 },
  productImage: { type: String, required: false },
});

module.exports = mongoose.model("Product", productSchema);
