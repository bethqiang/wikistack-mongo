const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swig = require('swig');
const path = require('path');

// Middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', './public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Swig stuff
// Point res.render to the proper directory
app.set('views', path.join(__dirname, '..', '/view'));
// Have res.render work with html files
app.set('view engine', 'html');
// When res.render works with html files, have it use swig to do so
app.engine('html', swig.renderFile);
// Turn off swig's caching
swig.setDefaults({ cache: false });

// Routes
const wikiRouter = require('./routes/wiki');
app.use('/wiki', wikiRouter);

// Basic route
app.get('/', (req, res, next) => res.render('index'));

// Start server
app.listen(port, () => console.log('Listening on port ' + port));

// Error handling
app.use('/', (err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});
