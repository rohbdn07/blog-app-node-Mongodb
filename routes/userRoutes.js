const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const checkDuplicateEmailorUsername = require("../AuthMiddleware/Auth");
const bcrypt = require("bcryptjs");

//this is Login route page...
router.get("/login", (req, res, next) => {
    res.render("login", {
        title: "loginPage",
    });
});

//this is Register route page...
router.get("/register", (req, res, next) => {
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

//router is exported to App.js.
module.exports = router;