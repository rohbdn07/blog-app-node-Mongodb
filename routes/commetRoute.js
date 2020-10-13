const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const checkLoginUser = require('../AuthMiddleware/Auth');
const { post } = require("./blogRoutes");
 
router.post("/blogs/coments/",checkLoginUser, (req, res) => {
    // console.log(req.body)
    const id=req.params._id;
    const loginUser = localStorage.getItem('loginUser');
    Blog.update({"_id":req.body.id},
    {
        $push:{
            "comments":{username:req.body.name, comment:req.body.comment}
        }
    },function(err,comment){
        if(err) return console.log('Cannot post a comment'+err);
         console.log('successfull comment'+comment)
        res.send({
          text:"comment successfull",
          _id:Blog.insertedId,
        })
       
        res.render('details', {
          title: 'saved comment',
          msg: 'comment posted successfully!',
          blogs: blog,
          loginUser: loginUser,
  
        });
    })
});

//Get request for the comment section...
router.get("/blogs/coments/", async (req, res) => {
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