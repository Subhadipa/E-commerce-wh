const productModel = require("../../Models/productModel");

const productView = async (req, res) => {
    try {
      if (req.user.isDeleted === false) {
        let productDetailsFromDb = await productModel.aggregate([
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
          message: "All the products with category are here!",
          data: productDetailsFromDb,
        });
      } else {
        return res
          .status(400)
          .send({ status: "false", message: "User doesn't exist!" });
      }
    } catch (error) {
      return res.status(500).send({ status: "false", message: error.message });
    }
  };

module.exports={productView}
