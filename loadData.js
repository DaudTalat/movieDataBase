const {response} = require('express');
const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connection;
const {Schema} = mongoose;

let app = express();

let data = require('./movie-data-2500.json');

let Movie = require("./models/movieModel.js");
let Person = require("./models/personModel.js");
const e = require('express');

let peopleArray = [];
let movieArray = [];
app.use(express.json());
mongoose.connect("mongodb://localhost/mDB", {useNewUrlParser:true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, "connection error: "));
db.once("open", function(error){
    if (error) throw err;
    db.dropDatabase(function(err, result){
        populate_Movies();
    });
});



function populate_Movies(){
    data.forEach(elem =>{
        let m = new Movie({
            title       : elem.Title,
            plot        : elem.Plot,
            runtime     : elem.Runtime,
            rating      : -1,
            genre       : elem.Genre,
            imageURL    : elem.Poster
        });

        //directors
        elem.Director.forEach(director =>{
            let find = peopleArray.findIndex(person =>{
                if(person.name === director){
                    return true;
                }else{
                    return false;
                }
            });

            if(find === -1){
                let p = new Person({
                    name : director,
                    directed: [m._id]
                });
                m.director.push(p._id);
                peopleArray.push(p);
            }else{
                peopleArray[find].directed.push(m._id);
                m.director.push(peopleArray[find]._id);
            }
            
        });

        //actors
        elem.Actors.forEach(actor =>{
            let find = peopleArray.findIndex(person =>{
                if(person.name === actor){
                    return true;
                }else{
                    return false;
                }
            });

            if(find === -1){
                let p = new Person({
                    name : actor,
                    acted_in: [m._id]
                });
                m.actors.push(p._id);
                peopleArray.push(p);
            }else{
                peopleArray[find].acted_in.push(m._id);
                m.actors.push(peopleArray[find]._id);
            }
        });

        //writers
        elem.Writer.forEach(writer =>{
            let find = peopleArray.findIndex(person =>{
                if(person.name === writer){
                    return true;
                }else{
                    return false;
                }
            });

            if(find === -1){
                let p = new Person({
                    name : writer,
                    wrote: [m._id]
                });
                m.writers.push(p._id);
                peopleArray.push(p);
            }else{
                peopleArray[find].wrote.push(m._id);
                m.writers.push(peopleArray[find]._id);
            }
            
        });

        movieArray.push(m);

    });
    saveMovies();
}

function saveMovies(){
    count = 0;
    movieArray.forEach(movie=>{
        movie.save(function(){
            count++;
            if(count === movieArray.length){
                savePeople();
            }
        });
    });
}

function savePeople(){
    count = 0;
    peopleArray.forEach(person =>{
        person.save(function(){
            count++;
            if(count === peopleArray.length){
                last();
            }
        });
    });
}

function last(){
    console.log(movieArray);
    console.log(peopleArray);
    console.log("done!!!");
}