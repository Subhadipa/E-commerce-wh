const productModel = require("../../Models/productModel");
const categoryModel = require("../../Models/categoryModel");

const productCreate = async (req, res) => {
  try {
    const { productName, size, categoryId, brand, price } = req.body;
    // let productCheck= await productModel.find({productName})
    if (req.user.isDeleted === false) {
      let categoryCheck = await categoryModel.findOne({
        _id: categoryId,
        isDeleted: false,
      });
      //console.log(categoryCheck.length)
      if (categoryCheck === null) {
        return res
          .status(400)
          .send({ status: "false", message: "Category doesn't exist!" });
      }
      let productCheck = await productModel.aggregate([
        {
          $match: {
            productName: productName.toLowerCase(),
          },
        },
      ]);

      if (productCheck.length !== 0) {
        return res.status(400).send({
          status: "false",
          message: "Product is already present in db!",
        });
      } else {
        let productDataSavedInDb = await productModel.create({
          productName,
          size,
          categoryId,
          brand,
          price,
        });
        return res.status(200).send({
          status: "true",
          message: "Product is created successfully!",
          data: productDataSavedInDb,
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

const productView = async (req, res) => {
  try {
    // let productDetailsFromDb=await productModel.find().populate("categoryId")
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
        .send({ status: "false", message: "Admin doesn't exist!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const productUpdateData = async (req, res) => {
  try {
    const { productId, productName } = req.body;
    if (req.user.isDeleted === false) {
      let productUpdatedDataDb = await productModel.findOneAndUpdate(
        { _id: productId, isDeleted: false },
        { productName: productName.toLowerCase() },
        {
          new: true,
        }
      );
      if (productUpdatedDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data updated successfully!",
          data: productUpdatedDataDb,
        });
      } else {
        return res.status(400).send({
          status: "false",
          message: "Data can't be updated!",
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const productDelete = async (req, res) => {
  try {
    const { productId } = req.body;
    if (req.user.isDeleted === false) {
      let productDataDb = await productModel.findOneAndUpdate(
        { _id: productId, isDeleted: false },
        { isDeleted: true },
        {
          new: true,
        }
      );
      if (productDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data deleted successfully!",
          data: productDataDb,
        });
      } else {
        return res.status(400).send({
          status: "false",
          message: "Data can't be deleted!",
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
module.exports = {
  productCreate,
  productView,
  productUpdateData,
  productDelete,
};
