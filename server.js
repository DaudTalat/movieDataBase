const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const {Schema} = mongoose;


let app = express();
app.set('view engine','pug');



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

let movieRouter = require('./routers/moviesRouter');
let peopleRouter = require('./routers/peopleRouter');

app.use("/movies",movieRouter);
app.use("/people",peopleRouter);



app.get("/",function(req,res){
    console.log(req.url);
    res.send("index");
});



mongoose.connect("mongodb://localhost/mDB", {useNewUrlParser:true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, "connection error: "));
db.once("open", function(error){
  app.listen(3000);
  console.log("Listening on port http://localhost:3000");
});