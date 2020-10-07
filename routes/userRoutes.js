const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const checkDuplicateEmailorUsername = require("../AuthMiddleware/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkLoginUser = require('../AuthMiddleware/Auth');
require('dotenv').config();
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}


//this is Login route page...
router.get("/login", (req, res, next) => {
    res.render("login", {
        title: "loginPage",
        msg: "",
    });
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    var email = req.body.email;
    const password = req.body.password;

    const checkUser = User.findOne({
        email: email,
    });
    checkUser.exec((err, data) => {
        if (err) throw err;
        const getUserID = data._id;
        const hashedPassword = data.password;
        if (bcrypt.compareSync(password, hashedPassword)) {
            let token = jwt.sign({
                    userID: getUserID
                },
                process.env.SECRETKEY,
            );
            localStorage.setItem('userToken', token);
            localStorage.setItem('loginUser', email);

            res.redirect('/blogs')
            // res.render("login", {
            //     title: "login authication",
            //     msg: "Yay! user logging sucessfully!!!",
            // });
        } else {
            res.render("login", {
                title: "login authication failed",
                msg: "oops! Username or password not matched",
            });
        }
    });
});

//this is Register route page...
router.get("/register", checkLoginUser, (req, res, next) => {
    res.render("register", {
        title: "registerPage",
        msg: "",
    });
});

//register POST to database...
router.post("/register", checkDuplicateEmailorUsername, (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (password !== confirmpassword) {
        res.render("register", {
            title: "login authication",
            msg: "Passoword not matched ",
        });
    } else {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const userDetails = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });
        userDetails.save((err, data) => {
            console.log(data);
            if (err) throw err;
            res.render("register", {
                title: "login authication",
                msg: "User registered successfully",
            });
        });
    }
});

router.get('/logout', checkLoginUser, (req, res, next) => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/login');
});

//router is exported to App.js.
module.exports = router;