//blog_get_all, blog_get_about, blog_get_create,blog_post,blog_put, blog_get_id, blog_delete, blog_get_edit_id, blog_search
const Blog = require("../models/blog");
 require('dotenv').config();

//Local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

const blog_get_all=(req,res)=>{
    const loginUserEmail = localStorage.getItem('loginUser');
  const loginUsername=localStorage.getItem('Loginusername');
  Blog.find({})
    .sort({
      createdAt: '-1', //blog will display in decending order.
    })
    .then((data) => {
      res.render("index", {
        title: "All blogs",
        blogs: data,
        loginUser: loginUserEmail,
        loginUsername:loginUsername,

      });
      console.log('logged as:' + loginUserEmail);
      console.log('logged as:' + loginUsername);

    })
    .catch((err) => {
      console.log("unable to get blogs", err);
      res.send("Opps! something went wrong", err);
    });
}

const blog_get_about=(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
  res.render("about", {
    title: "About",
    loginUser: loginUser,
  });
}

const blog_get_create=(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
  res.render("create", {
    title: "Create",
    msg: '',
    blogs: new Blog,
    loginUser: loginUser,
  });
}

const blog_post= async(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
    const file = req.files.file;
    const filename = file.name;
    console.log(filename);
    console.log(req.username);
    file.mv(`public/posts/${filename}`, async (err) =>{
    if (err) {
      console.log("File uploading err:" + err)
    };
    
    let blog = new Blog();
      blog.username= req.body.username
      blog.title=req.body.title
      blog.description=req.body.description
      blog.content=req.body.content
      blog.image= `/posts/${filename}`
    
    try {
      await blog.save();
      console.log('blog is saved to db')
      res.redirect('/blogs')
      console.log('file saved to db');
      } 
      catch (err) {
      res.render("create", {
        title: 'not saved',
        msg: 'opps! file not saved, Title name already exit!',
        blogs: blog,
        loginUser: loginUser,
      });
      console.log('data not saved' + '' + err)
  }
});
}

const blog_put =async(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
    const file = req.files.file;
    const filename = file.name;
    console.log(filename);
    console.log(req.username);
    file.mv(`public/posts/${filename}`, async (err) =>{
    if (err) {
      console.log("File uploading err:" + err)
    };
    let blog= await Blog.findById(req.params.id);
      blog.username= req.body.username
      blog.title=req.body.title
      blog.description=req.body.description
      blog.content=req.body.content
      blog.image= `/posts/${filename}`
    
    try {
      await blog.save();
      console.log('blog is saved to db')
      res.redirect('/blogs')
      console.log('file saved to db');
      } 
      catch (err) {
      res.render("edit", {
        title: 'not saved',
        msg: 'opps! file not saved, Title name already exit!',
        blogs: blog,
        loginUser: loginUser,
      });
      console.log('data not saved' + '' + err)
  }
});
}

const blog_get_id= async (req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
    const blog = await Blog.findOne({
      slug: req.params.slug
    });
    
    try {
      res.render("details", {
        title: "Blog details",
        blog:blog,
        loginUser: loginUser, 
      });
    } catch {
      (err) => console.log(err);
    }
}

const blog_delete=(req,res)=>{
    Blog.findOneAndDelete({
        slug: req.params.slug
      })
      .then(() => {
        res.json({
          redirect: "/blogs",
        });
      })
      .catch((err) => console.log(err));
}

const blog_get_edit_id=(req,res)=>{
    const id = req.params.id;
    const loginUser = localStorage.getItem('loginUser');
    Blog.findById({
        _id: id
      }).then((data) => {
        res.render("edit", {
          title: "Update blog",
          blog: data,
          loginUser: loginUser,
        });
      })
      .catch((err) => console.log(err));
}

const blog_post_search=(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
    const loginUsername=localStorage.getItem('loginUsername');
    let userPattern=new RegExp('^'+req.body.search.toLowerCase());
    const titleFilter= Blog.find({title:{$regex:userPattern}});
    titleFilter.exec((err, data) => {
      res.render("index", {
        title: "All blogs",
        blogs: data,
        loginUser: loginUser,
        loginUsername:loginUsername,
        });
    });
};
module.exports={
    blog_get_all,
    blog_get_about,
    blog_get_create,
    blog_post,
    blog_put,
    blog_get_id,
    blog_delete,
    blog_get_edit_id,
    blog_post_search
}