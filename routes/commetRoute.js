const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment=require('../models/comment');
const checkLoginUser = require('../AuthMiddleware/Auth');
 
//create a comment...
router.post("/blogs/:slug/comment", async(req, res) => {
    // console.log(req.body)
    
    const loginUser = localStorage.getItem('loginUser');
    const blog = await Blog.findOne({
    slug: req.params.slug
  });
  const comment= new Comment({
    name:req.body.name,
    comment:req.body.comment,
  });
  comment.blog=blog.slug;
  try{
    await comment.save();
    blog.comments.push(comment._id);
    await blog.save();
    res.render('details', {
      title: 'saved comment',
      msg: 'congratz! Comment is posted successfully',
      comment:comment,
      blogs: blog,
      loginUser: loginUser,
    });
    console.log('comment rendred on details posted')
  } catch(err){
    if(err) return console.log('Cannot post a comment'+err);
    console.log('successfull comment'+comment)


  }
});


//     blog.update({"_id":req.body.post_id},
//     {
//         $push:{
//             "comments":{username:req.body.name, comment:req.body.comment}
//         }
//     },function(err,comment){
//         if(err) return console.log('Cannot post a comment'+err);
//          console.log('successfull comment'+comment)
//         res.send({
//           text:"comment successfull",
//           _id:Blog.insertedId,
//         })
       
//         res.render('details', {
//           title: 'saved comment',
//           msg: 'comment posted successfully!',
//           blogs: blog,
//           loginUser: loginUser,
  
//         });
//     })
// });



//Get request for the comment section...
router.get("/blogs/:slug", async(req, res) => {
        // const id = req.params.id;
        const loginUser = localStorage.getItem('loginUser');                        
        const blog = await Blog.findOne({
          slug: req.params.slug
        });
      
        try {
          res.render("details", {
            title: "Blog details",
            msg: 'congratz! Comment is posted successfully',
            blog: blog,
            comment:comment,
            loginUser: loginUser,
            
          });
        } catch {
          (err) => console.log(err);
        }
      });

module.exports = router;