const categoryModel = require("../../Models/categoryModel");

const categoryCreate = async (req, res) => {
  try {
    const { categoryName } = req.body;

    //let categoryCheck = await categoryModel.find({ categoryName });
    if (req.user.isDeleted === false) {
      let categoryCheck = await categoryModel.aggregate([
        {
          $match: {
            categoryName: categoryName.toLowerCase(),
          },
        },
      ]);
      if (categoryCheck.length === 0) {
        let categorysaveDb = await categoryModel.create({ categoryName });
        return res.status(200).send({
          status: "true",
          message: "Category created successfully!",
          data: categorysaveDb,
        });
      } else {
        return res
          .status(400)
          .send({ status: "false", message: "Cateogry is present in the db!" });
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
const categoryView = async (req, res) => {
  try {
    // let categoryDetailsFromDb = await categoryModel.find()
    if (req.user.isDeleted === false) {
      let categoryDetailsFromDb = await categoryModel.aggregate([
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
        message: "All the categories are here!",
        data: categoryDetailsFromDb,
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
const categoryUpdateData = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    if (req.user.isDeleted === false) {
      let categoryUpdatedDataDb = await categoryModel.findOneAndUpdate(
        { _id: categoryId, isDeleted: false },
        { categoryName: categoryName.toLowerCase() },
        {
          new: true,
        }
      );
      if (categoryUpdatedDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data updated successfully!",
          data: categoryUpdatedDataDb,
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
const categoryDelete = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (req.user.isDeleted === false) {
      let categoryDataDb = await categoryModel.findOneAndUpdate(
        { _id: categoryId, isDeleted: false },
        { isDeleted: true },
        {
          new: true,
        }
      );
      if (categoryDataDb !== null) {
        return res.status(200).send({
          status: "true",
          message: "Data deleted successfully!",
          data: categoryDataDb,
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
  categoryCreate,
  categoryView,
  categoryUpdateData,
  categoryDelete,
};
