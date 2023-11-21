const productModel = require("../../Models/productModel");
const categoryModel = require("../../Models/categoryModel");

const productCreate = async (req, res) => {
  try {
    const { productName, size, categoryId, brand, price } = req.body;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }

    // let productCheck= await productModel.find({productName})

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
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

const productView = async (req, res) => {
  try {
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }

    // let productDetailsFromDb=await productModel.find().populate("categoryId")

    let productDetailsFromDb = await productModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          isDeleted: 0,
          createdOn: 0,
          __v: 0,
          categoryId: 0,
          categoryDetails: {
            status: 0,
            isDeleted: 0,
            createdOn: 0,
            __v: 0,
            //categoryName:1
          },
        },
      },
    ]);
    //console.log(productDetailsFromDb)
    if (productDetailsFromDb.length === 0) {
      return res.status(400).send({
        status: "false",
        message: "Product list can't be fetched!",
      });
    }
    return res.status(200).send({
      status: "true",
      message: "All the products with category are here!",
      data: productDetailsFromDb,
    });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const productUpdateData = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { productName, size, brand, price } = req.body;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }

  
      let productUpdatedDataDb = await productModel.findOneAndUpdate(
        { 
          _id: productId, 
          isDeleted: false, 
        //  size: { $in: size } 
        },
        {  
          // $set: {
          //   "size.$[element]": size
          // },
          productName: productName.toLowerCase(),
          price,
          $push: { size,brand } 
        },
        {
          new: true,
          //arrayFilters: [{ "element": { $in: size } }]
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
   
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const productDelete = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (req.user.isDeleted === true) {
      return res
        .status(400)
        .send({ status: "false", message: "Admin doesn't exist!" });
    }
   
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
