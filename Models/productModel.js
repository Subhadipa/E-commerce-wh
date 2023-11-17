const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    lowercase: true,
  },
  size: {
    type: [String],
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
  brand: [String],
  price: {
    type: String,
    default: 0.0,
  },
  status: {
    type: Boolean,
    default: true,
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

module.exports=mongoose.model("Product",productSchema)