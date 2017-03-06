const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => {
  Page.find({}).exec()
  .then(pages => res.render('index', { pages: pages }))
  .then(null, next);
});

router.post('/', (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags.split(', ')
  });
  page.save()
  .then(createdPage => res.redirect(createdPage.route))
  // Still unsure of how to hook moongoose into native promises to use .catch
  .then(null, next);
});

router.get('/add', (req, res, next) => res.render('addpage'));

router.get('/search', function (req, res, next) {
  const tagToSearch = req.query.search;
  Page.findByTag(tagToSearch)
  .then(pages => res.render('index', { pages: pages }))
  .then(null, next);
});

// Needs to be below add & search
router.get('/:urlTitle', (req, res, next) => {
  Page.findOne({ urlTitle: req.params.urlTitle })
  .exec()
  .then(foundPage => {
    if (foundPage === null) {
      res.status(404).send();
    } else {
      res.render('wikipage', { page: foundPage });
    }
  })
  .then(null, next);
});

router.get('/:urlTitle/similar', (req, res, next) => {
  Page.findOne({ urlTitle: req.params.urlTitle })
  .then(page => {
    if (page === null) {
      res.status(404).send();
    } else {
      return page.findSimilar().then(pages => res.render('index', { pages: pages }));
    }
  })
  .then(null, next);
});

module.exports = router;
