const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const checkLoginUser = require('../AuthMiddleware/Auth');
 
router.post("/comments/",checkLoginUser, (req, res) => {
    // console.log(req.body)
    const id=req.params._id;
    const loginUser = localStorage.getItem('loginUser');
    Blog.update({"_id":req.body._id},
    {
        $push:{
            'comments':{username:req.body.name, comment:req.body.comment}
        }
    },function(err,comment){
        if(err) return console.log('Cannot post a comment'+err);
        console.log('successfull comment'+comment)
    })
});

//Get request for the comment section...
router.get("/blogs/:id", async (req, res) => {
        // const id = req.params.id;
        const loginUser = localStorage.getItem('loginUser');
        const blog = await Blog.findOne({
          slug: req.params.slug
        });
      
        try {
          res.render("details", {
            title: "Blog details",
            blog: blog,
            loginUser: loginUser,
          });
        } catch {
          (err) => console.log(err);
        }
      });

module.exports = router;