const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const {Schema} = mongoose;


let router = express.Router();

let Movie = require("../models/movieModel");
let Person = require("../models/personModel");
let User = require("../models/userModel");

router.post("/create",createAccount);
router.use("/profile",getProfile);

function getProfile(req,res){
    console.log(req.method);
    res.render("profile",{user:req.session.user});
}

function createAccount(req,res){
    console.log(req.body);
    let  un =  req.body.username;
    User.findOne({username:un}).exec(function(error, user ){
        console.log(user);
        if(user === null){
            let u = new User({
                username: un,
                password: req.body.password
            });
            u.save(function(err,result){
                if(err){
                    res.
                    res.render("error",{error:err});
                }else{
                    req.session.user = u;
                    res.redirect('profile');
                }
            });
        }else{
            res.render("error",{error:"username already exists!"});
        }
    });
}





module.exports = router;