const userModel = require("../../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getTokenData = async (authorization) => {
  const userData = await userModel
    .findOne({
      token: authorization,
    })
    .exec(); //handling exceptions here also can be done by then and catch
  // console.log("userData", userData)
  return userData;
};

const userView = async (req, res) => {
  try {
    let userDetailsFromDb = await userModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $project: {
          password: 0,
          token: 0,
          status: 0,
          isDeleted: 0,
          createdOn: 0,
          __v: 0,
        },
      },
    ]);
    return res.status(200).send({
      status: "true",
      message: "All list of users are here!",
      data: userDetailsFromDb,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const userUpdateData = async (req, res) => {
  try {
    const { userId, fullName } = req.body;
    if (req.user._id.toString() === userId) {
      let userUpdatedDataDb = await userModel.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { fullName },
        {
          new: true,
        }
      );

      if (userUpdatedDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data updated successfully!",
          data: userUpdatedDataDb,
        });
      } else {
        
        return res.status(400).send({
          status: "false",
          message: "Data can't be updated!",
        });
      
      }
    } else {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to update the data!",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const userDelete = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.user._id.toString() === userId) {
      let userDataDb = await userModel.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { isDeleted: true },
        {
          new: true,
        }
      );
      if (userDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data deleted successfully!",
          data: userDataDb,
        });
      } else {
        return res.status(400).send({
          status: "false",
          message: "Data can't be deleted!",
        });
      }
    } else {
      return res.status(400).send({
        status: "false",
        message: "You are not authorize to delete the data!",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

module.exports = {
  userView,
  userUpdateData,
  userDelete,
  getTokenData,
};
