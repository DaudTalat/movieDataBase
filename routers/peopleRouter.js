const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const {Schema} = mongoose;

let Movie = require("../models/movieModel");
let Person = require("../models/personModel");

let router = express.Router();

router.get("/:pId", getPerson);

function getPerson(req,res){
    Person.findById(req.params.pId).
    populate([{path:'directed'},{path:'acted_in'}, {path:'wrote'}]).
    exec(function(error,person){
        if (error) throw error;

        res.render('person', {person:person});

    });
}

module.exports = router;
