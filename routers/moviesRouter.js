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
router.post("/:mId/addReview",add_Reviews);
router.get("/search", get_Search_List);
router.get("/:mId",getMovie);


function getMovie(req,res){
    console.log("Here!");
    Movie.findById(req.params.mId).populate([{path:'actors'},{path:'writers'},{path:'director'},{path:"reviews"}]).exec(function(err,movie){
        console.log(movie);

        if(movie === null){
            res.render('error',{error:"movie not found!"});
        }else{

            let query = [];
            movie.genre.forEach(elem =>{
                query.push({genre:elem});
            });
            let output = [];


            Movie.findRandom({genre:movie.genre}, {}, {limit:5}, function(e1,r1){
                let find = r1.findIndex(elem =>{
                    if(elem.title === movie.title){
                        return true;
                    }else{
                        return false;
                    }
                });
                //console.log(r);
                if(find != -1){
                    r1.splice(find,1);
                }
    
    
                if(r1.length < 5){
                    output = output.concat(r1);
                    let templength = 5 - output.length;
                    Movie.findRandom({$or:query},{},{limit:templength},function(e2,r2){
                        let find = r2.findIndex(elem =>{
                            if(elem.title === movie.title){
                                return true;
                            }else{
                                return false;
                            }
                        });
                        //console.log(r);
                        if(find != -1){
                            r2.splice(find,1);
                        }
    
                        output = output.concat(r2);
                        console.log(output);

                        let reviewed = false;

                        if(req.session.user != undefined ){
                            movie.reviews.forEach(ele =>{
                                console.log(ele.username);
                                console.log(req.session.user._id);
                                if(ele.username.toString() === req.session.user._id.toString()){
                                    reviewed = true;
                                }
                            });
                        }

                        console.log(reviewed);
                        res.render('movie',{movie:movie, recommended:output, link:req.session.link, reviewed:reviewed});
                    });
                }else{
                    res.render('movie',{movie:movie, recommended:r1, link:req.session.link});
                }
            });
        }       
    });
}

function add_Reviews(req,res){
    //get movie
    //get user
    //check if user has 
    Movie.findById(req.params.mId).exec(function(error,movie){

        User.findById(req.session.user._id).exec(function(e,user){

            let r = new Review({
                username:req.session.user,
                movie:movie._id,
                rating: req.body.rating,
                title: req.body.title,
                text: req.body.text
            });

            movie.reviews.push(r._id);
            user.reviews.push(r._id);
            r.save(function(){
                movie.save(function(){
                    user.save(function(){
                        res.redirect("/movies/"+req.params.mId);
                    });
                });
            });
        });
        
    });
}



function get_Search_List(req,res){
  let cursor = parseInt(req.query.page -1) * parseInt(req.query.limit);
  let prev_url = "http://localhost:3000/movies/search?movie_Title=" +req.query.movie_Title+"&person_Name="+req.query.person_Name+"&genre="+req.query.genre+"&limit=" +req.query.limit+ "&page="+ (parseInt(req.query.page)-1).toString();
  let next_url = "http://localhost:3000/movies/search?movie_Title=" +req.query.movie_Title+"&person_Name="+req.query.person_Name+"&genre="+req.query.genre+"&limit=" +req.query.limit+ "&page="+ (parseInt(req.query.page)+1).toString();
  let q = req.query;
  let query = [];
  
  if(q.title != ""){
    query.push({title:{$regex: new RegExp("^"+q.movie_Title, "i")}});
  }


  if(q.person_Name != ""){
    query.push({all_People:{$regex: new RegExp("^"+q.person_Name, "i")}});
  }

  if(q.genre != ""){
    query.push({genre:q.genre});
  }

  console.log(query);


  Movie.find({$and:query}).limit(parseInt(req.query.limit)).skip(cursor).exec(function(err,result){
    if (err) throw err;
    if(result === null){
      res.status(404);
      res.send("Could not find any movies");
    }else{
      res.status(200);
      res.render('searchList',{result: result, next: next_url, prev: prev_url, curr: parseInt(req.query.page), link:req.session.link});
    }
  });
}



module.exports = router;