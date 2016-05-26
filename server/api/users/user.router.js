'use strict';

var router = require('express').Router();

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');
var Story = require('../stories/story.model');

router.param('id', function (req, res, next, id) {
  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});

router.get('/', function (req, res, next) {
  if (req.user) {
    User.findAll({})
    .then(function (users) {
      res.json(users);
    })
    .catch(next);
  } else {
    res.send('Improper Access')
    console.log('Improper Access detected!')
  }
});

router.post('/', function (req, res, next) {
  if (req.user.isAdmin) {
    User.create(req.body)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(next);
  } else {
    res.send('Improper Access')
    console.log('Improper Access detected!')
  }
});

router.get('/:id', function (req, res, next) {
  if (req.user) {
    req.requestedUser.reload({include: [Story]})
    .then(function (requestedUser) {
      res.json(requestedUser);
    })
    .catch(next);
  } else {
    res.send('Improper Access')
    console.log('Improper Access detected!')
  }
});

router.put('/:id', function (req, res, next) {
  if (req.user.isAdmin || req.user.id === userId) {
    req.requestedUser.update(req.body)
    .then(function (user) {
      res.json(user);
    })
    .catch(next);
  } else {
    res.send('Improper Access')
    console.log('Improper Access detected!')
  }
});

router.delete('/:id', function (req, res, next) {
  var userId = req.params.id;
  if (req.user.isAdmin || req.user.id === userId) {
    req.requestedUser.destroy()
    .then(function () {
      res.status(204).end();
    })
    .catch(next);
  } else {
    res.send('Improper Access')
    console.log('Improper Access detected!')
  }
});

module.exports = router;
