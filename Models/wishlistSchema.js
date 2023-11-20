const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // action: {
  //   type: String,
  //   enum: ["Add", "Remove"],
  //   required: true,
  // },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  updatedOn: {
    type: Date,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
