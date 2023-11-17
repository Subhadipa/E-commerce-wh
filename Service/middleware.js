// an empty user object creation for the data returned by middleware
var user = {}

var adminController = require('../Controllers/admin/adminController');
var userController=require("../Controllers/user/userController")
var response = require('../Service/response');

//MIDDLEWARE

//these urls does not need any middleware check
const permission = [

    {
        url: "/admin/register"
    },
    {
        url: "/admin/login"
    },
    {
        url: "/user/register"
    },
    {
        url: "/user/login"
    }

]

//definition of middleware
//filter method will create new arr for permission arraygetTokenData
user.middleware = async (req, res, next) => {
    if (permission.filter(item => item.url == req.url).length > 0) {
        next();
    } else {
        
        if (!req.headers.authorization) {
            return res.status(response.errorCode.requiredError).json({ error: "No Credentials Send", status: false, credentials: false })
        } else {
            let authorization = req.headers.authorization;
           // console.log("authorization", authorization)
            let userData = null;

            let usertype = typeof (req.headers.usertype) != "undefined" ? req.headers.usertype : "admin"

            if (usertype == "admin") {
                userData = await adminController.getTokenData(authorization)
                // console.log("userData",userData)
            }else if(usertype == "user"){
                userData = await userController.getTokenData(authorization)
            }
            //now we have user data which we can use fgetTokenDataurther

            if (userData && userData != null) {
                userData.password = null;
                userData.token = null;
                req.user = userData;
                req.usertype = usertype;
                req.token=req.headers.authorization
                next();
            } else {

                res.status(response.errorCode.authError).json({ error: "No Credentials Send", status: false, Credential: false })
            }

        }
    }

}

//exporting user without curly braces because user is itself a object.
module.exports = user