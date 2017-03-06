const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const Promise = require('bluebird');
const Page = models.Page;
const User = models.User;
module.exports = router;

// /users
router.get('/', function (req, res, next) {
  User.find({}).exec()
  .then(users => {
    res.render('userlist', { users: users });
  })
  .then(null, next);
});

// /users/(dynamicvalue)
router.get('/:userId', function (req, res, next) {
  const findUser = User.findById(req.params.userId).exec();
  const findPages = Page.find({ author: req.params.userId }).exec();
  Promise.all([findUser, findPages])
  .then(info => {
    const foundUser = info[0];
    const foundPages = info[1];
    res.render('userpages', {
      pages: foundPages,
      user: foundUser
    });
  })
  .then(null, next);
});
