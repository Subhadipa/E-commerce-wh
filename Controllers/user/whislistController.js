const wishlistModel = require("../../Models/wishlistSchema");
const mongoose = require("mongoose");
const whisList = async (req, res) => {
  const { user, product } = req.body;

  if (req.user._id.toString() === user) {
    let whisListCheck = await wishlistModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(product),
        },
      },
    ]);
    if (whisListCheck.length === 0) {
      let wishListDataAdd = await wishlistModel.create({
        user,
        product,
      });
      return res.status(200).send({
        status: "true",
        message: "Product added to wishlist successfully!",
        data: wishListDataAdd,
      });
    } else {
       await wishlistModel.deleteOne({ product });
      return res.status(200).send({
        status: "true",
        message: "Product deleted from wishlist successfully!",
      });
    
    }
  } else {
    return res.status(400).send({
      status: "false",
      message:"You are not authorize neither to add nor to delete in wish list!",
    });
  }
};

module.exports = { whisList };