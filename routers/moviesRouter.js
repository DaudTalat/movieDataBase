const { response } = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const db = mongoose.connection;
const { Schema } = mongoose;

let Movie = require("../models/movieModel");
let Person = require("../models/personModel");
let Review = require("../models/reviewModel");
let User = require("../models/userModel");

let router = express.Router();
router.post("/:mId/addReview", add_Reviews);
router.get("/search", get_Search_List);
router.get("/:mId", getMovie);


function getMovie(req, res) {

    if (req.session.user === undefined) {
        req.session.link = "logIn";
    } else {
        req.session.link = "profile";
    }

    Movie.findById(req.params.mId).
        populate([{ path: 'actors' }, { path: 'writers' }, { path: 'director' }, { path: "reviews" }]).
        exec(function (err, movie) {

            if (movie === null) {
                res.status(404);
                res.render('prompt', { prompt: "Movie Not Found." });
            } else {

                let query = [];
                let output = [];
                let reviewed = false;
                let added = false;

                //adding all genre tags to query
                movie.genre.forEach(elem => {
                    query.push({ genre: elem });
                });


                //checking is user is logged in or not
                if (req.session.user != undefined) {

                    //checking if user has added review for movie
                    movie.reviews.forEach(ele => {
                        if (ele.username.toString() === req.session.user._id.toString()) {
                            added = true;
                        }
                    });

                    //checking if user has added to movie to watchList
                    req.session.user.watchList.forEach(ele => {
                        if (ele._id.toString() === req.params.mId) {
                            added = true;
                        }
                    });

                }


                Movie.findRandom({ genre: movie.genre }, {}, { limit: 5 }, function (e1, recommendations) {

                    if (e1) {
                        res.status(500);
                        res.render('prompt', { prompt: "Internal Server Error." });
                    } else {
                        //checking if movie is added to movie recommendations 
                        //removing duplicate movie if there is one
                        let find = recommendations.findIndex(elem => {
                            if (elem.title === movie.title) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                        if (find != -1) {
                            recommendations.splice(find, 1);
                        }

                        if (recommendations.length < 5) {

                            output = output.concat(recommendations);
                            let tempLength = 5 - output.length;

                            Movie.findRandom({ $or: query }, {}, { limit: tempLength }, function (e2, moreRecommendations) {

                                if (e2) {
                                    res.status(500);
                                    res.render('prompt', { prompt: "Internal Server Error." });
                                } else {
                                    //checking if movie is added to movie recommendations 
                                    //removing duplicate movie if there is one
                                    let find = moreRecommendations.findIndex(elem => {
                                        if (elem.title === movie.title) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });

                                    if (find != -1) {
                                        moreRecommendations.splice(find, 1);
                                    }

                                    output = output.concat(moreRecommendations);
                                    recommendations = recommendations.concat(moreRecommendations);

                                    res.status(200);
                                    res.render('movie', { movie: movie, recommended: recommendations, link: req.session.link, reviewed: reviewed, added: added });
                                }
                            });
                        } else {
                            res.status(200);
                            res.render('movie', { movie: movie, recommended: recommendations, link: req.session.link, reviewed: reviewed, added: added });
                        }
                    }
                });
            }
        });
}

function add_Reviews(req, res) {

    Movie.findById(req.params.mId).exec(function (error, movie) {

        if (error) {
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        } else {
            User.findById(req.session.user._id).exec(function (e, user) {

                if (e) {
                    res.status(500);
                    res.render('prompt', { prompt: "Internal Server Error." });
                } else {

                    let r = new Review({
                        username: req.session.user,
                        movie: movie._id,
                        rating: req.body.rating,
                        title: req.body.title,
                        text: req.body.text
                    });

                    movie.reviews.push(r._id);
                    user.reviews.push(r._id);

                    r.save(function () {
                        movie.save(function () {
                            user.save(function () {
                                res.redirect("/movies/" + req.params.mId);
                            });
                        });
                    });
                }
            });
        }
    });
}



function get_Search_List(req, res) {
    let cursor = parseInt(req.query.page - 1) * parseInt(req.query.limit);
    let prev_url = "http://localhost:3000/movies/search?movie_Title=" + req.query.movie_Title + "&person_Name=" + req.query.person_Name + "&genre=" + req.query.genre + "&limit=" + req.query.limit + "&page=" + (parseInt(req.query.page) - 1).toString();
    let next_url = "http://localhost:3000/movies/search?movie_Title=" + req.query.movie_Title + "&person_Name=" + req.query.person_Name + "&genre=" + req.query.genre + "&limit=" + req.query.limit + "&page=" + (parseInt(req.query.page) + 1).toString();
    let q = req.query;
    let query = [];

    //creating a query list for searching
    if (q.title != "") {
        query.push({ title: { $regex: new RegExp("^" + q.movie_Title, "i") } });
    }
    if (q.person_Name != "") {
        query.push({ all_People: { $regex: new RegExp("^" + q.person_Name, "i") } });
    }
    if (q.genre != "") {
        query.push({ genre: q.genre });
    }



    Movie.find({ $and: query }).limit(parseInt(req.query.limit)).skip(cursor).exec(function (err, result) {
        if (err) {
            res.status(500);
            res.render('prompt', { prompt: "Internal Server Error." });
        } else if (result === null) {
            res.status(404);
            res.send("Could not find any movies");
        } else {
            res.status(200);
            res.render('searchList', { result: result, next: next_url, prev: prev_url, curr: parseInt(req.query.page), link: req.session.link });
        }
    });
}



module.exports = router;