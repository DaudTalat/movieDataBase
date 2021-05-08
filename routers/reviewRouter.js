const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const {Schema} = mongoose;

let Movie = require("../models/movieModel");
let Person = require("../models/personModel");
let Review = require("../models/reviewModel");
let User = require("../models/userModel");

let router = express.Router();

router.get("/:rId",getReview);
router.delete("/:rId",deleteReview);

function deleteReview(req,res){
    //get review,
    //get user,
    //get movie//
    //change movie, user 
    //save movie, user, delete reviews
    //redirect to profile page :)

    Review.findById(req.params.rId).exec(function(e1,review){
        console.log(review);
        User.findById(review.username).exec(function(e2,user){
            console.log(user);
            Movie.findById(review.movie).exec(function(e3,movie){
                
                let i = movie.reviews.findIndex(elem =>{
                    if(elem._id === review._id){
                        return true;
                    }else{
                        return false;
                    }
                });

                let j = user.reviews.findIndex(elem =>{
                    if(elem._id === review._id){
                        return true;
                    }else{
                        return false;
                    }
                });

                movie.reviews.splice(i,1);
                user.reviews.splice(j,1);

                req.session.user = user;

                movie.save(function(){
                    user.save(function(){
                        Review.deleteOne({_id:review._id}, function(e4,r4){
                            res.status(200);
                            res.send("oK!");
                        });
                    });
                });

                
            });
        });
    });
}

function getReview(req,res){
    Review.findById(req.params.rId).
    populate([{path:"username"},{path:"movie"}]).
    exec(function(error,review){
        res.render("review",{review:review})
    });
}


module.exports = router;
