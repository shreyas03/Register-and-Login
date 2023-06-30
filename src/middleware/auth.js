const jwt = require("jsonwebtoken")
const model  = require("../model/mongodb")
const coll1 = model.coll1

const auth = (req,res,next) => {
    try {
        const cook = req.cookies.jwcook
        const verifyUser = jwt.verify(cook, process.env.jwtTokey)
        console.log(verifyUser)

        const user = coll1.findOne({_id:verifyUser.id})
        console.log(user)

        req.cook = cook
        req.user = user

        next()
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;