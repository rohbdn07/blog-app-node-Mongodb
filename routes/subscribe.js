const express = require("express");
const router = express.Router();

router.get('/blogs/subscribe',(req,res)=>{
    res.send('this is suscribe')
})


//router is exported to App.js.
module.exports = router;