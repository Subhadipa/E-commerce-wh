const mongoose=require("mongoose")

const adminSchema=new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String,
       // unique:true
    },
    password:{
        type:String,
    },
    token:{
        type:String,
        default:""
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

adminSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true }, isDeleted: false } });

module.exports=mongoose.model("Admin",adminSchema)