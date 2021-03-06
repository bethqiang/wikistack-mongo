const mongoose = require('mongoose');

// Setting up db
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

// Setting up schemas
const statuses = ['open', 'closed'];

const pageSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  urlTitle: { type: String, required: true },
  content:  { type: String, required: true },
  status:   { type: String, enum: statuses },
  // Passing Date.now instead of invoking it so that invocation registers
  // when the document is created instead of as soon as our app boots
  date:     { type: Date, default: Date.now },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:     { type: [String], index: true }
});

// Virtual fields
pageSchema.virtual('route').get(function () {return `/wiki/${this.urlTitle}`;});

// Pre-validate hook
// Uses the title field to generate urlTitle before any page instance is validated
pageSchema.pre('validate', function (next) {
  if (this.title) {
    this.urlTitle = this.title.replace(/\s/g, '_').replace(/\W/g, '');
  } else {
    this.urlTitle = Math.random().toString(36).substring(2, 7);
  }
  next();
});

pageSchema.statics.findByTag = function (tag) {
  return Page.find({
    tags: {
      $in: [tag]
    }
  }).exec();
};

pageSchema.methods.findSimilar = function () {
  return Page.find({
    tags: { $in: this.tags },
    _id: { $ne: this._id }
  }).exec();
};


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// Arrow function here?
userSchema.statics.findOrCreate = function (props) {
  const self = this;
  return self.findOne({ email: props.email }).exec().then(user => {
    if (user) return user;
    else return self.create({
      email: props.email,
      name:  props.name
    });
  });
};

// mongoose.model is called to compile the schemas into collection-managing models
const Page = mongoose.model('Page', pageSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};
