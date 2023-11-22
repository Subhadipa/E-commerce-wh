const orderModel = require("../../Models/orderModel");
const cartModel = require("../../Models/cartModel");
const productModel = require("../../Models/productModel");
const mongoose = require("mongoose");
const createOrder = async (req, res) => {
  try {
    const { userId, cartId, address, paymentMethod, cardDetails } = req.body;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "User doesn't exist!" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to create the order!",
      });
    }
    let cartDetails = await cartModel.findOne({ _id: cartId, userId });
   // console.log(cartDetails)
    let orderObj = {
        userId,
        cartId,
        items: cartDetails.items,
        total: cartDetails.total,
        ...req.body,
      };
      let updatedObj={
        items: cartDetails.items,
        total: cartDetails.total,
      }
     //console.log("OrderObj",OrderObj)
     
    if (cartDetails === null) {
      return res
        .status(400)
        .send({ status: false, message: "Cart doesn't exist!" });
    }
  
    let cartCheck =   await orderModel.findOne({ cartId })
    //console.log(cartCheck)
    if (cartCheck) {
        await orderModel.findOneAndUpdate({ cartId },updatedObj,{new:true});
      return res
        .status(400)
        .send({ status: "false", message: "Order Already Placed!" });
    }
    let OrderDataSavedInDb = await orderModel.create(orderObj);
    return res.status(200).send({
      status: "true",
      message: "Order is placed successfully!",
      data: OrderDataSavedInDb,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const getOrder = async (req, res) => {
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
        message: "You are not authorize to fetch the order details!",
      });
    }
  
    const OrderCheck = await orderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          cartId: new mongoose.Types.ObjectId(cartId),
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
        },
      },
    ]);
    //console.log(OrderCheck)
    if (OrderCheck.length === 0) {
      return res.status(400).send({
        status: "false",
        message: `Order doesn't exist!`,
      });
    } else {
      return res.status(200).send({
        status: "true",
        message: `Your order details is here!`,
        data: OrderCheck,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

const updateOrder=async(req,res)=>{
    try{
    const orderId=req.params.orderId
    const {address,paymentMethod}=req.body
    const orderCheck=await orderModel.findOneAndUpdate({orderId},{...req.body},{new:true})
    if(orderCheck){
        return res.send(200).send({status:true,message:"Order Updated successfully",data:orderCheck})
    }else{
        return res.send(400).send({status:true,message:"Order can't be updated successfully!"})
    }
    }catch (error) {
        return res.status(500).send({ status: "false", message: error.message });
      }

}

module.exports = { createOrder, getOrder,updateOrder };
