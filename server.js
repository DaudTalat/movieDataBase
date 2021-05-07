const {response} = require('express');
const express = require('express');
const pug = require('pug');
const mongoose = require("mongoose");
const session = require("express-session");
const db = mongoose.connection;
const {Schema} = mongoose;



let app = express();
app.set('view engine','pug');



let genre_List = [
    'Comedy','Drama','Horror','Mystery','Crime','Thriller','Romance','War',
    'Western','Documentary','Music','Animation','Adventure','Family','Sci-Fi',
    'Action','Fantasy','Sport','Short','Biography','History','N/A','Musical',
    'Film-Noir','News' 
];



let movieRouter = require('./routers/moviesRouter');
let peopleRouter = require('./routers/peopleRouter');
let userRouter = require('./routers/userRouter');
let reviewRouter = require('./routers/reviewRouter');


app.use(express.urlencoded({ extended: true}));
app.use(session({secret:'some secret key here'}));

app.use("/movies",movieRouter);
app.use("/people",peopleRouter);
app.use("/users",userRouter);
app.use("/reviews",reviewRouter);




app.get("/",function(req,res){
    console.log(req.session.user);
    if(req.session.user  === undefined){
        req.session.link = "logIn";
    }else{
        req.session.link = "profile";
    }
    res.render("index", {link:req.session.link});
});

app.get("/search", function(req,res){
    console.log(req.session.link);
    res.render("search", {genre:genre_List,link:req.session.link});
});

app.get("/logIn", function(req,res){
    res.render("logIn",{link:req.session.link});
});



mongoose.connect("mongodb://localhost/mDB", {useNewUrlParser:true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, "connection error: "));
db.once("open", function(error){
    
    app.listen(3000);
    console.log("Listening on port http://localhost:3000");
});