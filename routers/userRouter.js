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
            res.send("oK!");
        })


    });
}


function addToWatchList(req,res){
    if(req.session.user === undefined){
        res.render("error", {error:"Please Log In First"});
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
    User.findOne({username: req.body.username, password: req.body.password}).populate([{path:"reviews"},{path:"watchList"}]).exec(function(error,result){
        if(error){
            res.render("error",{error:error});
            throw error;
        }else if(result === null){
            res.render("error",{error:"could not find user"});
        }else{
            req.session.user = result;
            req.session.link = "profile";
            res.redirect('/users/profile');
        }
    });
}

function getProfile(req,res){
    res.status(200);
    User.findById(req.session.user._id).populate([{path:"reviews"},{path:"watchList"}]).exec(function(err, user){
        req.session.user = user;
        res.render("profile",{user:user,link:req.session.link});
    });
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

    console.log(req.url);

    User.findById(req.params.uId).
    populate([{path:"watchList"},{path:"reviews"}]).
    exec(function(error,user){
        res.render("users",{user:user});
    });
}




module.exports = router;