const PublicQues = require("../model/questionbankModel");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://root@192.168.188.104:27017/exam_system_db", {
    user: "root",
    pass: "123456",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
//PASSWORD=SNNU_pro_3418!
/*
var animalSchema = new mongoose.Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function (cb) {
  return this.model("Animal").find({ type: this.type }, cb);
};

animalSchema.pre("save", function (next) {
  if (!this.created) this.created = new Date();
  next();
});

  animalSchema.pre('validate', function (next) {
    if (this.name !== 'Woody') this.name = 'Woody';
    next();
  });
//animalSchema.post("save", function (doc) {
  //console.log("this fired after a document was saved");
//});
animalSchema.post('save', function(doc, next) {
    setTimeout(function() {
      console.log('post11111111111111111111');
      // Kick off the second post hook
      next();
    }, 5000);
  });
  
  // Will not execute until the first middleware calls `next()`
  animalSchema.post('save', function(doc, next) {
    console.log('post22222222222222222222');
    next();
  });
animalSchema.post("find", function (docs) {
  console.log("this fired after you run a find query");
});

var Animal = mongoose.model("Animal", animalSchema);
var dog = new Animal({ name: "dog", type: "dog" });
var woof = new Animal({ name: "woof", type: "dog" });
dog
  .save()
  .then(() => woof.save())
  .then(() =>
    dog.findSimilarTypes(function (err, dogs) {
      console.log(dogs); // woof
    })
  )
  .then(() =>
  //var Animal = mongoose.model("Animal", animalSchema);
    Animal.find({ type: "dog" }, "name type").exec(function (err, result) {
      console.log(result);
    })
  );
//woof.save();
//dog.findSimilarTypes(function (err, dogs) {
// console.log(dogs); // woof
//});
console.log("-----------------");
*/
async function modifyQues() {
  try {
    const data = await PublicQues.find( { 'statement.right_answer': '正确' },);
    for(var i=0;i<data.length;i++){
      console.log("data["+i+"]= "+data[i]._id)
    }
    
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};