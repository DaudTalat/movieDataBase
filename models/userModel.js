const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");


let userSchema = new Schema({
    username: String,
    password: String,
    contributing: Boolean,
    following_users: [{type:Schema.Types.ObjectId,ref:"user"}],
    following_people: [{type:Schema.Types.ObjectId,ref:"person"}],
    watchList: [{type:Schema.Types.ObjectId,ref:"movie"}],
    recommended: [{type:Schema.Types.ObjectId,ref:"movie"}], 
    reviews: [{type:Schema.Types.ObjectId,ref:"review"}]
});


let User = mongoose.model("user",userSchema);

module.exports = User;


