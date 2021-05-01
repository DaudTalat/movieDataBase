const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const {Schema} = mongoose;


let app = express();
app.set('view engine','pug');

let Movie = require("./models/movieModel");
let Person = require("./models/personModel");

let genre_List = [
    'Comedy',
    'Drama',
    'Horror',
    'Mystery',
    'Crime',
    'Thriller',
    'Romance',
    'War',
    'Western',
    'Documentary',
    'Music',
    'Animation',
    'Adventure',
    'Family',
    'Sci-Fi',
    'Action',
    'Fantasy',
    'Sport',
    'Short',
    'Biography',
    'History',
    'N/A',
    'Musical',
    'Film-Noir',
    'News' 
];

/*
{ genre: [ 'Comedy', 'Drama', 'Romance', 'Western' ],
    director: [ 608b22cf413f7018c72977f3 ],
    writers: [ 608b22cf413f7018c72977f8, 608b22cf413f7018c72977f9 ],
    actors:
     [ 608b22cf413f7018c72977f4,
       608b22cf413f7018c72977f5,
       608b22cf413f7018c72977f6,
       608b22cf413f7018c72977f7 ],
    reviews: [],
    _id: 608b22cf413f7018c72977f2,
    title: 'The Ballad of Cable Hogue',
    plot:
     'A hobo accidentally stumbles onto a water spring, and creates a profitable way station in the middle of the desert.',
    runtime: '121 min',
    rating: -1,
    __v: 0 }
*/

app.get("/movies/:mId",getMovie);


app.get("/",function(req,res){
    console.log(req.url);
    res.send("index");
});


function getMovie(req,res){
    console.log("Here!");
    Movie.findById(req.params.mId).populate([{path:'actors'},{path:'writers'},{path:'director'}]).exec(function(err,movie){
        console.log(movie);

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

                    res.render('movie',{movie:movie, recommended:output});
                });
            }else{
                res.render('movie',{movie:movie, recommended:r1});
            }
        });

       
    });
}


mongoose.connect("mongodb://localhost/mDB", {useNewUrlParser:true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, "connection error: "));
db.once("open", function(error){
  app.listen(3000);
  console.log("Listening on port http://localhost:3000");
});