const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");


let reviewSchema = new Schema({
    username: {type:Schema.Types.ObjectId,ref:"user"},
    movie: {type:Schema.Types.ObjectId,ref:"movie"},
    rating: Number,
    title: String,
    text: String
});


let Review = mongoose.model("review",reviewSchema);

module.exports = Review;

