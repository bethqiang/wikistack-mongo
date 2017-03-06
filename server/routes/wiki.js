const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => res.redirect('/'));

router.post('/', (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content
  });
  page.save()
  .then(createdPage => res.redirect(createdPage.route))
  // Still unsure of how to hook moongoose into native promises to use .catch
  .then(null, next);
});

router.get('/add', (req, res, next) => res.render('addpage'));

// Needs to be below add
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

module.exports = router;
