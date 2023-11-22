const wishlistModel = require("../../Models/wishlistSchema");
const mongoose = require("mongoose");

const whisList = async (req, res) => {
  const { userId, productId } = req.body;

  if (req.user.isDeleted === true) {
    return res
      .status(400)
      .send({ status: "false", message: "User doesn't exist!" });
  }

  if (req.user._id.toString() !== userId) {
    return res.status(400).send({
      status: "false",
      message:
        "You are not authorize neither to add nor to delete in wish list!",
    });
  }

  let whisListCheck = await wishlistModel.findOne({ userId, productId });

  if (whisListCheck === null) {
    let wishListDataAdd = await wishlistModel.create({
      userId,
      productId,
    });
    return res.status(200).send({
      status: "true",
      message: "Product added to wishlist successfully!",
      data: wishListDataAdd,
    });
  } else {
    await wishlistModel.deleteOne({ userId, productId });
    return res.status(200).send({
      status: "true",
      message: "Product deleted from wishlist successfully!",
    });
  }
};

const getWishList = async (req, res) => {
  const userId = req.params.userId;
  if (req.user.isDeleted === true) {
    return res
      .status(400)
      .send({ status: "false", message: "User doesn't exist!" });
  }

  if (req.user._id.toString() !== userId) {
    return res.status(400).send({
      status: "false",
      message:
        "You are not authorize neither to add nor to delete in wish list!",
    });
  }
  let wishListDetailsDb = await wishlistModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryDetails",
            },
          },
        ],
        as: "productDetails",
      },
    },

    {
      $project: {
        userId: 0,
        productId: 0,
        isDeleted: 0,
        createdOn: 0,
        __v: 0,
        userDetails: {
          email: 0,
          password: 0,
          token: 0,
          status: 0,
          isDeleted: 0,
          createdOn: 0,
          __v: 0,
        },
        productDetails: {
          status: 0,
          isDeleted: 0,
          createdOn: 0,
          __v: 0,
          categoryId: 0,
          categoryDetails: {
            status: 0,
            isDeleted: 0,
            createdOn: 0,
            __v: 0,
          },
        },
      },
    },
  ]);
  // console.log(wishListDetailsDb)
  if (wishListDetailsDb.length === 0) {
    return res.status(400).send({
      status: "false",
      message: "Wish list can't be fetched!",
    });
  } else {
    return res.status(200).send({
      status: "true",
      message: "The whislist is here!",
      data: wishListDetailsDb,
    });
  }
};
module.exports = { whisList, getWishList };
