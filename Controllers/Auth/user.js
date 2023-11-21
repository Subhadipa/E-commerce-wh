const userModel = require("../../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(userData) {
  return jwt.sign(userData, process.env.SECRET_KEY);
}

const register = async (req, res) => {
    try {
      let saltRounds = 10;
      const { fullName, email, password } = req.body;
      //let emailCheck = await userModel.find({ email });
      let emailCheck = await userModel.aggregate([
        {
          $match: {
            email,
            isDeleted:false
          },
        },
      ]);
      if (emailCheck.length !== 0) {
        return res
          .status(400)
          .send({ status: "false", message: "This email already exist in db!" });
      } else {
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        let userData = {
          fullName,
          email,
          password: encryptedPassword,
          token: generateToken(req.body),
        };
        let userDataInDb = await userModel.create(userData);
        return res.status(200).send({
          status: "true",
          message: "New user created successfully!",
          data: userDataInDb,
        });
      }
    } catch (error) {
      return res.status(500).send({ status: "false", message: error.message });
    }
  };
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let userCheck = await userModel.findOne({ email,isDeleted:false });
      //console.log(userCheck)
      if (userCheck) {
        let passwordCheck = await bcrypt.compare(password, userCheck.password);
        if (passwordCheck) {
          const { _id, fullName ,token} = userCheck;
          // let token = jwt.sign({ userId: userCheck._id }, "webhibe");
          // res.header("x-api-key", token);
          // await userModel.updateOne({ token: token });
  
          return res.status(200).send({
            status: "true",
            message: `${fullName} is logged in successfully`,
            data: {
              userId:_id,
              token
  
            }
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
  module.exports = {
    register,
    login,
}  