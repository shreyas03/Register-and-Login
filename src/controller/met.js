const fs = require('fs');
const mongoose = require('mongoose')
const express = require("express")
const server = express()
const model = require("../model/mongodb")
const coll1 = model.coll1;
const f1 = model.f1
const multer = require("multer")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
server.use(express.json())
server.use(cookieParser())



exports.createUser = async (req, res) => {

    const check = await coll1.findOne({ mail: req.body.mail });
    const ucheck = await coll1.findOne({ uname: req.body.uname });
    const pcheck = req.body.pwd
    const p2check = req.body.pwd2
    try {
      if(!check){
          if(!ucheck){
            if(pcheck === p2check){
              const encPwd = await bcrypt.hash(pcheck, 10)
              const data = {
                name: req.body.name,
                mail: req.body.mail,
                uname: req.body.uname,
                pwd: encPwd
              };
              await coll1.insertMany(data)
              const token = jwt.sign(
                {id: data._id}, process.env.jwtTokey, {
                  expiresIn: "2h"
                }
              )
              console.log(data)
              data.token = token
              data.pwd = undefined
              // res.status(201).json(data)
            } else {
              res.send("Passwords do not match")
            }
            
          }
         else{
          res.send("Username taken")
          console.log(e)
        }
      }
      else {
        res.send("Email already exists!")
      }
    } catch (err) {
      res.send("Internal Server Error!")
    }


    res.render("login")
}
exports.valUser = async (req, res) => {
  try{
    console.log(req.body.uname)
    console.log(req.body.pwd)
    const pcheck = req.body.pwd
    const ucheck = await coll1.findOne({ uname: req.body.uname });

    if(ucheck && (await bcrypt.compare(pcheck, ucheck.pwd))){
      const token = jwt.sign(
        {id: ucheck._id}, process.env.jwtTokey, {
          expiresIn: "2h"
        }
      )
      ucheck.token = token
      ucheck.pwd = undefined
      const opt = {
        expires: new Date(Date.now() + 3*24*60*60*100),
        httpOnly:true
      }
      // res.status(100).cookie("token", token, opt).json({
      //   success:true
      // })
      res.render("home")
    }

    else{
      res.send("Wrong password")
    }
  } catch {
    res.send("Wrong credentials")
  }
}

exports.upFile = async (req,res) => {
  const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) =>
    cb(null, Date.now()+file.originalname)
  })

  const upload = multer({
    storage: Storage
  }).single("file")

  upload(req,res, (err) => {
    if (err) {
      console.log(err)
    } else {
      const newFile = new f1({
        name: req.body.name,
        file: {
          data: req.file.filename,
          contentType: 'application/pdf'
        }  
      })
      newFile.save()
      .then(()=>res.send("Your file has been uploaded succesfully. Please return to the previous page"))
      .catch(err => console.log(err))
    }
  })
  
}

exports.rendlog = (req,res) => {
    res.render('login')
}

exports.rendsign = (req,res) => {
    res.render('signup')
}

exports.rendhome = (req, res) => {
  res.render('home');
};
  