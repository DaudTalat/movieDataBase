const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");


let userSchema = new Schema({
    username: String,
    password: String,
    contributing: Boolean,
    following_users: [{type:Schema.Types.ObjectId,ref:"User"}],
    following_people: [{type:Schema.Types.ObjectId,ref:"Person"}],
    watchList: [{type:Schema.Types.ObjectId,ref:"Movie"}],
    recommended: [{type:Schema.Types.ObjectId,ref:"Movie"}], 
    reviews: [{type:Schema.Types.ObjectId,ref:"Review"}]
});


let User = mongoose.model("user",userSchema);

module.exports = User;


