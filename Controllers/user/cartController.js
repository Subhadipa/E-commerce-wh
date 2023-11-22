const cartModel = require("../../Models/cartModel");
const productModel = require("../../Models/productModel");
const mongoose = require("mongoose");

const cartCreate = async (req, res) => {
  try {
    const { userId, items } = req.body;
    let productTotalAmount = 0;
    let total = 0,
      createdObj = {};
    let newItems = [];
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "User doesn't exist!" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to create the cart!",
      });
    }

    for (const element of items) {
      const productCheck = await productModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(element.productId),
            isDeleted: false,
          },
        },
      ]);

      if (productCheck.length === 0) {
        return res.status(400).send({
          status: "false",
          message: `Product doesn't exist!`,
        });
      }

      productTotalAmount = parseInt(productCheck[0].price * element.quantity);
      total += productTotalAmount;
      createdObj = {
        productId: element.productId,
        quantity: element.quantity,
        productTotal: productTotalAmount,
      };
      newItems.push(createdObj);
    }

    const cartDataSavedInDB = await cartModel.create({
      userId,
      items: newItems,
      total,
    });
    return res.status(200).send({
      status: "true",
      message: "Cart created successfully!",
      data: cartDataSavedInDB,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "User doesn't exist!" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to fetch the cart!",
      });
    }

    const cartCheck = await cartModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
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
          localField: "items.productId",
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
        $group: {
          _id: "$_id",
          total: { $first: "$total" },
          userDetails: { $first: "$userDetails" },
          items: { $push: "$items" },
          productDetails: { $push: "$productDetails" },
        },
      },
    
      {
        $project: {
          userId: 0,
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
    // console.log(cartCheck)
    if (cartCheck.length === 0) {
      return res.status(400).send({
        status: "false",
        message: `Cart doesn't exist!`,
      });
    } else {
      return res.status(200).send({
        status: "true",
        message: `The cart is here!`,
        data: cartCheck,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const cartUpdate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartId = req.params.cartId;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "User doesn't exist!" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to update the cart!",
      });
    }
    const { items } = req.body;
    let totalAmount = 0;

    for (let element of items) {
      let productCheck = await productModel.findOne({
        _id: new mongoose.Types.ObjectId(element.productId),
      });
      //console.log(productCheck)
      if (productCheck) {
        const cartCheck = await cartModel.findOne({
          _id: cartId,
          userId,
          "items.productId": new mongoose.Types.ObjectId(element.productId),
          isDeleted: false,
        });
        // console.log(cartCheck)
        if (cartCheck === null) {
          return res
            .status(400)
            .send({ status: "false", message: "Cart doesn't exist!" });
        } else {
          const cartPreviousQuantity = cartCheck.items.filter(
            (prod) => prod.productId == element.productId
          );
          //  console.log(cartPreviousQuantity)
          let pervQuantity = cartPreviousQuantity[0].quantity;
          let prevProductTotal = cartPreviousQuantity[0].productTotal;
          prevProductTotal +=
            Math.abs(pervQuantity - element.quantity) * productCheck.price;
          totalAmount +=
            cartCheck.total +
            Math.abs(pervQuantity - element.quantity) * productCheck.price;
          const productQuantityUpdate = await cartModel.findOneAndUpdate(
            {
              _id: cartId,
              userId,
              "items.productId": new mongoose.Types.ObjectId(element.productId),
              isDeleted: false,
            },
            {
              $set: {
                "items.$.quantity": element.quantity,
                "items.$.productTotal": prevProductTotal,
                total: totalAmount,
              },
            },
            { new: true }
          );
          return res.status(200).send({
            status: "true",
            message: "Quantity updated successfully!",
            data: productQuantityUpdate,
          });
        }
      } else {
        return res
          .status(400)
          .send({ status: "false", message: "Product doesn't exist!" });
      }
    }
  } catch (error) {
    //console.log(error);
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const cartDelete = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartId = req.params.cartId;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "User doesn't exist!" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to update the cart!",
      });
    }

    let cartUpdatedDataDb = await cartModel.findOneAndUpdate(
      { _id: cartId, userId, isDeleted: false },
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (cartUpdatedDataDb !== null) {
      return res.status(200).send({
        status: "true",
        message: "Cart deleted successfully!",
        data: cartUpdatedDataDb,
      });
    } else {
      return res.status(400).send({
        status: "false",
        message: "Data can't be deleted!",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

module.exports = {
  cartCreate,
  getCart,
  cartUpdate,
  cartDelete,
};
