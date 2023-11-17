const cartModel = require("../../Models/cartModel");
const productModel = require("../../Models/productModel");
const mongoose = require("mongoose");

const cartCreate = async (req, res) => {
  try {
    const { userId, items } = req.body;
    let totalAmount = 0;

    if (req.user._id.toString() === userId) {
      for (const element of items) {
        const productCheck = await productModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(element.product),
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
        totalAmount += parseInt(productCheck[0].price * element.quantity);
      }

      cartObject = { ...req.body, total: totalAmount };
      const cartDataSavedInDB = await cartModel.create(cartObject);
      return res.status(200).send({
        status: "true",
        message: "Cart created successfully!",
        data: cartDataSavedInDB,
      });
    } else {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to create the cart!",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.user._id.toString() === userId) {
      const cartCheck = await cartModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            isDeleted: false,
          },
        },
      ]);
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
    } else {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to get the cart!",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

const cartDelete = async (req, res) => {
    try {
        const { userId,cartId } = req.body;
        if (req.user._id.toString() === userId) {
            let cartUpdatedDataDb = await cartModel.findOneAndUpdate(
                { _id: cartId, isDeleted: false },
                { isDeleted:true},
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

        }else {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to delete the cart!",
      });
    }
    }catch (error) {
        return res.status(500).send({ status: "false", message: error.message });
      }
};

module.exports = {
  cartCreate,
  getCart,
  cartDelete
};
