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
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Virtual fields
pageSchema.virtual('route').get(() => `/wiki/${this.urlTitle}`);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// mongoose.model is called to compile the schemas into collection-managing models
const Page = mongoose.model('Page', pageSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};
