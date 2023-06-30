const express = require("express")
const metController = require('../controller/met')
const auth = require('../middleware/auth')
const router = express.Router()


router

    .get("/",metController.rendlog)
    .get("/home",metController.rendhome)
    .get("/signup",metController.rendsign)
    .get("/upload",auth, metController.rendup)
    .get("/disp",metController.rendtest)
    .get("/display",auth,metController.rendview)
    .get("/uploads/:fileName", metController.rendfile)
    .get("/logout",auth, metController.outuser)
    .post("/upload", metController.upFile)
    .post("/signup",metController.createUser)
    .post("/login",metController.valUser)
    exports.router = router;
