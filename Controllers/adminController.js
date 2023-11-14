const adminModel = require("../Models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let saltRounds = 10;
    const { fullName, email, password } = req.body;
    //let emailCheck = await adminModel.find({ email });
    let emailCheck = await adminModel.aggregate([
      {
        $match: {
          email,
        },
      },
    ]);
    if (emailCheck.length !== 0) {
      return res
        .status(400)
        .send({ status: "false", message: "This email already exist in db!" });
    } else {
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      let adminData = {
        fullName,
        email,
        password: encryptedPassword,
      };
      let adminDataInDb = await adminModel.create(adminData);
      return res.status(200).send({
        status: "true",
        message: "New admin created successfully!",
        data: adminDataInDb,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let userCheck = await adminModel.findOne({ email });
    //console.log(userCheck)
    if (userCheck) {
      let passwordCheck = await bcrypt.compare(password, userCheck.password);
      if (passwordCheck) {
        const { _id, fullName } = userCheck;
        let token = jwt.sign({ adminId: userCheck._id }, "webhibe");
        res.header("x-api-key", token);
        await adminModel.updateOne({ token: token });

        return res.status(200).send({
          status: "true",
          message: `${fullName} is logged in successfully`,
          token: token,
        });
      } else {
        return res
          .status(400)
          .send({ status: "false", message: "Invalid credentials!" });
      }
    } else {
      return res
        .status(400)
        .send({ status: "false", message: "This email doesn't exist in db!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
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
    let adminUpdatedDataDb = await adminModel.findOneAndUpdate(
      { _id: adminId ,isDeleted:false},
      { fullName },
      {
        new: true,
      }
    );

    if(adminUpdatedDataDb!==null){
    return res.status(200).send({
      status: "true",
      message: "Data updated successfully!",
      data: adminUpdatedDataDb,
    });
  }else{
    return res.status(400).send({
      status: "false",
      message: "Data can't be updated!",
    });
  }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const adminDelete = async (req, res) => {
  try {
    const { adminId } = req.body;
    let adminDataDb = await adminModel.findOneAndUpdate(
      { _id: adminId,isDeleted:false},
      { isDeleted: true },
      {
        new: true,
      }
    );
    if(adminDataDb!==null){
    return res.status(200).send({
      status: "true",
      message: "Data deleted successfully!",
      data: adminDataDb,
    });
  }else{
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
  register,
  login,
  adminView,
  adminUpdateData,
  adminDelete
};
