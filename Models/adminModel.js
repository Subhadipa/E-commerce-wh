const mongoose=require("mongoose")

const adminSchema=new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    token:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdOn:{
        type:Date,
        default:new Date()
    },
    updatedOn:{
        type:Date,
    },
})

module.exports=mongoose.model("Admin",adminSchema)