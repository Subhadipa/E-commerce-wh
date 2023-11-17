const adminModel = require("../../Models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getTokenData = async (authorization) => {
  const userData = await adminModel
    .findOne({
      token: authorization,
    })
    .exec(); //handling exceptions here also can be done by then and catch
  // console.log("userData", userData)
  return userData;
};

const adminView = async (req, res) => {
  try {
    let adminDetailsFromDb = await adminModel.aggregate([
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
      message: "All list of admins are here!",
      data: adminDetailsFromDb,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const adminUpdateData = async (req, res) => {
  try {
    const { adminId, fullName } = req.body;
    if (req.user._id.toString() === adminId) {
      let adminUpdatedDataDb = await adminModel.findOneAndUpdate(
        { _id: adminId, isDeleted: false },
        { fullName },
        {
          new: true,
        }
      );

      if (adminUpdatedDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data updated successfully!",
          data: adminUpdatedDataDb,
        });
      } else {
        6;
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
const adminDelete = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (req.user._id.toString() === adminId) {
      let adminDataDb = await adminModel.findOneAndUpdate(
        { _id: adminId, isDeleted: false },
        { isDeleted: true },
        {
          new: true,
        }
      );
      if (adminDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data deleted successfully!",
          data: adminDataDb,
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
  adminView,
  adminUpdateData,
  adminDelete,
  getTokenData,
};
