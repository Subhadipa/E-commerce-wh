let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productTotal:{
        type: Number,
        default: 0,
      }
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  updatedOn: {
    type: Date,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
