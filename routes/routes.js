const express = require('express');
const routes = express.Router();

routes.post('/register',(req,res)=>{
    res.json({
        status:true,
        msg:'This is a post register request'
    })
})
routes.post('/login',(req,res)=>{
    res.json({
        status:true,
        msg:'This is a post login request'
    })
})

module.exports = routes;
