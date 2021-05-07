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
let Review = require("../models/reviewModel");

const session = require('express-session');

router.post("/create",createAccount);
router.get("/profile",getProfile);
router.post("/logout",logOut);
router.post("/logIn", logIn);
router.get("/:uId",getUser);


function getProfileJS(req,res){

    let p = require("../public/profile");
    res.sendFile("../public/profile",{header:{"content-type":"application/json"}});
}


function logIn(req,res){
    User.findOne({username: req.body.username, password: req.body.password}).populate({path:"reviews"}).exec(function(error,result){
        if(error){
            res.render("error",{error:error});
            throw error;
        }else if(result === null){
            res.render("error",{error:"could not find user"});
        }else{
            console.log(result.reviews);
            req.session.user = result;
            req.session.link = "profile";
            res.redirect('profile');
        }
    });
}

function getProfile(req,res){
    console.log(req.method);
    res.render("profile",{user:req.session.user,link:req.session.link});
}

function logOut(req,res){
    req.session.user = undefined;
    req.session.link = "logIn";
    res.redirect("/");
}

function createAccount(req,res){
    console.log(req);
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
                    
                    res.render("error",{error:err});
                }else{
                    req.session.user = u;
                    req.session.link = "profile";
                    res.redirect('profile');
                }
            });
        }else{
            res.render("error",{error:"username already exists!"});
        }
    });
}


function getUser(req,res){
    User.findById(req.params.uId).
    populate([{path:"watchList"},{path:"reviews"}]).
    exec(function(error,user){
        res.render("users",{user:user});
    });
}




module.exports = router;