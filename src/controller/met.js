const fs = require('fs');
const mongoose = require('mongoose')
const express = require("express")
const server = express()
const path = require('path')
const model = require("../model/mongodb")
const coll1 = model.coll1;
const f1 = model.f1
const multer = require("multer")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const { token } = require('morgan');
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
    console.log(ucheck._id)
    const idno = ucheck._id
    const username = req.body.uname
    const user = {name: username, id: idno}
    if(ucheck && (await bcrypt.compare(pcheck, ucheck.pwd))){
      const token = jwt.sign(
        user, process.env.jwtTokey
      )
      ucheck.token = token
      ucheck.pwd = undefined
      // console.log(token)
      const opt = {
        expires: new Date(Date.now() + 3*24*60*60*100),
        httpOnly:true
      }
      res.cookie("jwcook", token, opt)
      res.render("home")
    }

    else{
      res.send("Wrong password")
    }
  } catch {
    res.send("Wrong credentials")
  }
}
exports.outuser = async(req,res) => {
  try {
    res.clearCookie("jwcook")
    res.render('login')
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.upFile = async (req, res) => {
  try {
    const userId = req.query.userId;

    const Storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });

    const upload = multer({
      storage: Storage
    }).single('image');

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.send('Error uploading file');
      }

      const newFile = new f1({
        name: req.body.name,
        desc: req.body.desc,
        img: {
          data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)),
          contentType: req.file.mimetype
        },
        fileName: req.file.filename,
        postedBy: userId
      });

      await newFile.save();
      console.log('req.file:', req.file.filename);
      console.log('req.body:', req.body);
      res.render('upload', { userId});
    });
  } catch (error) {
    console.log(error);
    res.send('Error uploading file');
  }
};

exports.rendhome = (req, res) => {
try {
  let userId

  if (req.query.userId) {
    userId = req.query.userId;
  } else {
    const token = req.cookies.jwcook;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.jwtTokey);
    userId = decoded.id;
  }
  res.render('home', {userId});
} catch (error) {
  res.send("Error rendering the requested page")
}
};

exports.rendup = async (req, res) => {
  try {
    let userId;

    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      const token = req.cookies.jwcook;

      if (!token) {
        return res.status(401).send("Unauthorized");
      }
      const decoded = jwt.verify(token, process.env.jwtTokey);
      userId = decoded.id;
    }
    res.render('upload', { userId});
  } catch (error) {
    res.send("Error rendering upload page");
  }
};

exports.rendview = async (req, res) => {
  try {
    let userId;
    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      const token = req.cookies.jwcook;

      if (!token) {
        return res.status(401).send("Unauthorized");
      }

      const decoded = jwt.verify(token, process.env.jwtTokey);
      userId = decoded.id;
    }

    const uploadedImages = await f1.find({ postedBy: userId });
    console.log(uploadedImages)
    res.render('disp', { userId, uploadedImages });
  } catch (error) {
    res.send("Error rendering the requested page");
  }
};

exports.rendfile = (req,res) => {
  const fileName = req.params.fileName;
  res.sendFile(fileName, { root: __dirname + '/../uploads' });
}

exports.rendlog = (req,res) => {
  res.render('login')
}
exports.rendtest = (req,res) => {
res.render('disp')
}
exports.rendsign = (req,res) => {
  res.render('signup')
}