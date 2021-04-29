const mongoose = require("mongoose");
const {Schema} = mongoose;
const random = require("mongoose-simple-random");

let personSchema = new Schema({
    name: String,
    directed: [{type:Schema.Types.ObjectId,ref:"movie"}],
    acted_in: [{type:Schema.Types.ObjectId,ref:"movie"}],
    wrote: [{type:Schema.Types.ObjectId,ref:"movie"}],
    top_collaborators: [{type:Schema.Types.ObjectId,ref:"person"}]
});

//personSchema.plugin('random');

let Person = mongoose.model("person",personSchema);

module.exports = Person;

