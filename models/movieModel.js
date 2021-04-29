const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");


let movieSchema = new Schema({
    title           : String,
    plot            : String,
    release_Date    : Date  ,
    runtime         : String,
    rating          : Number,
    genre           : [String],
    director        : [{type:Schema.Types.ObjectId,ref:'person'}],
    writers         : [{type:Schema.Types.ObjectId,ref:'person'}],
    actors          : [{type:Schema.Types.ObjectId,ref:'person'}],
    reviews         : [{type:Schema.Types.ObjectId,ref:'review'}],
    imageURL           : String
});

//movieSchema.plugin(random);
//returns string array of all people who worked on movie without repeats

let Movie = mongoose.model("movie",movieSchema);

module.exports = Movie;

