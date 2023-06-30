require("dotenv").config()
const express = require("express")
const server = express()
const path = require("path")
const viewsPath = path.join(__dirname, '../templates/views');
const morgan = require("morgan")
const reqRouter = require('../src/routes/req')
const cookieParser = require("cookie-parser");


server.use(express.json())
server.use(morgan("tiny"))
server.set("view engine","hbs")
server.set("views", viewsPath)
server.use(express.static('src/uploads'));
server.use(express.urlencoded({extended:true}))
server.use(cookieParser())

server.use('/', reqRouter.router)

server.listen(process.env.port, ()=>{
    console.log("Port Connected");
})