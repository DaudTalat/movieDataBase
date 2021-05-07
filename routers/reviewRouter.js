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

function getReview(req,res){
    Review.findById(req.params.rId).
    populate([{path:"username"},{path:"movie"}]).
    exec(function(error,review){
        res.render("review",{review:review})
    });
}


module.exports = router;
