const categoryModel = require("../Models/categoryModel");

const categoryCreate = async (req, res) => {
  try {
    const { categoryName } = req.body;
    //let categoryCheck = await categoryModel.find({ categoryName });
    let categoryCheck = await categoryModel.aggregate([
      {
        $match:{
          categoryName
        }
      }
    ]);
    if (categoryCheck.length === 0) {
      let categorysaveDb = await categoryModel.create({ categoryName });
      return res.status(200).send({
        status: "true",
        message: "Category created successfully!",
        data: categorysaveDb
       
      });
    } else {
      return res
        .status(400)
        .send({ status: "false", message: "Cateogry is present in the db!" });
    }
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const categoryView = async (req, res) => {
  try {
    // let categoryDetailsFromDb = await categoryModel.find()
    let categoryDetailsFromDb = await categoryModel.aggregate([
      {
        $match: {
          isDeleted: false,
        }
      },
      {
        $project: {
          isDeleted: 0,
          createdOn: 0,
          __v: 0,
        },
      },
    ]);
    return res
      .status(200)
      .send({
        status: "true",
        message: "All the categories are here!",
        data: categoryDetailsFromDb,
      });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};
const categoryUpdateData = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    let categoryUpdatedDataDb = await categoryModel.findOneAndUpdate(
      { _id: categoryId,isDeleted:false},
      { categoryName },
      {
        new: true,
      }
    );
    if(categoryUpdatedDataDb!==null){
    return res.status(200).send({
      status: "true",
      message: "Data updated successfully!",
      data: categoryUpdatedDataDb
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
const categoryDelete = async (req, res) => {
  try {
    const { categoryId } = req.body;
    let categoryDataDb = await categoryModel.findOneAndUpdate(
      { _id: categoryId,isDeleted:false},
      { isDeleted: true },
      {
        new: true,
      }
    );
    if(categoryDataDb!==null){
    return res.status(200).send({
      status: "true",
      message: "Data deleted successfully!",
      data: categoryDataDb,
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

// const categoryView =(req,res)=>{
//   categoryModel.aggregate([
//     {
//       $match:{
//         isDeleted:false,
//       }
//     },
//     {
//       $project:{
//       isDeleted:0,
//       createdOn:0,
//       __v:0
//       }
//     }
//   ]).then((data)=>{
//     res.status(200).json({
//       status:true,
//       message:"view succesfully",
//       data:data
//     })
//   }).catch((error)=>{
//     res.status(500).json({
//       status:false,
//       message:"error"
//     })
//   })
// }
module.exports = { categoryCreate, categoryView,categoryUpdateData,categoryDelete };
