
const mongoose = require('mongoose');
var animalSchema = new mongoose.Schema({ name: String, type: String });

  // assign a function to the "methods" object of our animalSchema
  animalSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({ type: this.type }, cb);
  };
var Animal = mongoose.model('Animal', animalSchema);
var dog = new Animal({ type: 'dog' });
var woof =new Animal({type: 'dog'});
dog.findSimilarTypes(function(err, dogs) {
    console.log(dogs); // woof
});