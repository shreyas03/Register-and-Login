const express = require("express")
const metController = require('../controller/met')


const router = express.Router()

router
    .post("/signup",metController.createUser)
    .post("/login",metController.valUser)
    .get("/",metController.rendlog)
    .get("/signup",metController.rendsign)
    .post("/upload", metController.upFile)
exports.router = router