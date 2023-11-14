const adminModel = require("../Models/adminModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const register = async (req, res) => {
    try {
        let saltRounds = 10
        const { fullName, email, password } = req.body
        let emailCheck = await adminModel.find({ email })
        if (emailCheck.length !== 0) {
            return res.status(400).send({ status: "false", message: "This email already exist in db!" })

        } else {
            const encryptedPassword = await bcrypt.hash(password, saltRounds)
            let adminData = {
                fullName, email, password: encryptedPassword
            }
            let adminDataInDb = await adminModel.create(adminData)
            return res.status(200).send({ status: "true", message: "New admin created successfully!", data: adminDataInDb })


        }
    } catch (error) {

        return res.status(500).send({ status: "false", message: error.message })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body


        let userCheck = await adminModel.findOne({ email })
        if (userCheck) {
            let passwordCheck = await bcrypt.compare(password, userCheck.password)
            if (passwordCheck) {
                const { _id, fullName } = userCheck
                let token = jwt.sign({ adminId: userCheck._id }, "webhibe")
                res.header("x-api-key", token)
                return res.status(200).send({ status: "true", message: `${fullName} is logged in successfully`, token: token })
            }
        } else {
            return res.status(400).send({ status: "false", message: "Invalid credentials!" })
        }
    } catch (error) {
        return res.status(500).send({ status: "false", message: error.message })
    }
}



module.exports = {
    register, login
}