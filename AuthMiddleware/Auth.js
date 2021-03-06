const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

const checkLoginUser = (req, res, next) => {
  try {
    let decoded = jwt.verify(userToken, process.env.SECRETKEY);
    decoded.exec((err,payload)=>{
      if(err) return console.log('Authicatation error :'+err);
      const {_id}=payload;
      User.findById(_id).then(userdata=>{
        req.user=userdata;
        next();
      })
    })
  } catch (err) {
    res.redirect('/login');

  }
  next();
}

checkDuplicateEmailorUsername = (req, res, next) => {
  let email = req.body.email;
  let username = req.body.username;

  const existUsername = User.findOne({
    username: username,
  });
  existUsername.exec((err, user) => {
    if (err) throw err;

    if (user) {
      return res.render("register", {
        title: "registerpage",
        msg: "Failed! Username is already existed!",
      });
    }
  });

  const existEmail = User.findOne({
    email: email,
  });
  existEmail.exec((err, user) => {
    if (err) return console.log(err);

    if (user) {
      console.log(user);
      return res.render("register", {
        title: "registerpage",
        msg: "Failed! Email is already existed!",
      });
    }
    next();
  });
};

module.exports = checkDuplicateEmailorUsername;
module.exports = checkLoginUser;
 