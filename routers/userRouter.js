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

router.delete("/profile/watchList/:wId",removeFromWatchList);
router.post("/profile/watchList",addToWatchList);
router.post("/create",createAccount);
router.get("/profile",getProfile);
router.post("/logout",logOut);
router.post("/logIn", logIn);
router.get("/:uId",getUser);


function removeFromWatchList(req,res){
    User.findById(req.session.user._id).exec(function(error, user){
        if(error){
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        }else{
            let index = user.watchList.findIndex(ele =>{
                if(ele.toString() === req.params.wId){
                    return true;
                }else{
                    return false;
                }
            });
    
            user.watchList.splice(index,1);
    
            user.save(function(){
                res.status(200);
                res.render('prompt', { prompt: "Movie Removed From WatchList" });
            });
        }
    });
}


function addToWatchList(req,res){
    if(req.session.user === undefined){
        res.status(406);
        res.render('prompt', { prompt: "Please Log In First." });
    }else{
        User.findById(req.session.user._id).exec(function(error,user){
            user.watchList.push(req.body.movie);
            Movie.findById(req.body.movie).exec(function(e1,movie){
                req.session.user.watchList.push(movie);
                user.save(function(){
                    res.redirect("/movies/"+req.body.movie);
                });
            });
        });
    }
    
}


function logIn(req,res){
    User.findOne({username: req.body.username, password: req.body.password}).
    populate([{path:"reviews"},{path:"watchList"}]).
    exec(function(error,result){
        if(error){
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        }else if(result === null){
            res.status(404);
            res.render('prompt', { prompt: "User Not Found." });
        }else{
            req.session.user = result;
            req.session.link = "profile";
            res.redirect('/users/profile');
        }
    });
}

function getProfile(req,res){
    User.findById(req.session.user._id).
    populate([{path:"reviews"},{path:"watchList"}]).
    exec(function(err, user){
        if(err){
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        }else{
            req.session.user = user;
            res.status(200);
            res.render("profile",{user:user,link:req.session.link});
        }
    });
}

function logOut(req,res){
    req.session.user = undefined;
    req.session.link = "logIn";
    res.redirect("/");
}

function createAccount(req,res){

    let  un =  req.body.username;

    User.findOne({username:un}).exec(function(error, user ){
        if(error){
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        }else if(user === null){
            let u = new User({
                username: un,
                password: req.body.password
            });
            u.save(function(err){
                if(err){
                    res.status(500);
                    res.render('prompt', { prompt: "Internal Server Error." });
                }else{
                    req.session.user = u;
                    req.session.link = "profile";
                    res.redirect('profile');
                }
            });
        }else{
            res.status(406);
            res.render('prompt', { prompt: "Username Already Exist." });
        }
    });
}


function getUser(req,res){
    User.findById(req.params.uId).
    populate([{path:"watchList"},{path:"reviews"}]).
    exec(function(error,user){
        if(error){
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        }else{
            res.status(200);
            res.render("users",{user:user});
        }
    });
}


module.exports = router;