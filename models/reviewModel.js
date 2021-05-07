const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");


let reviewSchema = new Schema({
    username: {type:Schema.Types.ObjectId,ref:"User"},
    movie: {type:Schema.Types.ObjectId,ref:"Movie"},
    rating: Number,
    title: String,
    text: String
});


let Review = mongoose.model("review",reviewSchema);

module.exports = Review;

