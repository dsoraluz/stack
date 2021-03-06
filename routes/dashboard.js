const express = require('express');
const StackModel = require('../models/stack-model.js');
const ensureLogin = require("connect-ensure-login");
const router  = express.Router();

router.get('/dashboard/', (req, res, next) => {
  res.redirect('/dashboard/home');
});

router.get('/dashboard/home', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  res.render('dash-views/dashboard.ejs', { layout: 'dashlayout.ejs' });
});

router.get('/dashboard/my-stacks', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {

// find all due stacks\

  StackModel.find({}, {cards: {$elemMatch: {dueToday: true}}},

    (err, dueList) => {

      if (err) {
          next(err);
          return;
      }

      res.locals.dueLength = dueList;


// find all Stacks

  StackModel.find(

    { user: req.user._id },

    (err, stackList) => {

      if (err) {
          next(err);
          return;
      }

      // send the results to the view
      res.locals.allStacks = stackList;

      res.locals.path = 'My Stacks';

      res.render('dash-views/my-stacks.ejs', { layout: 'dashlayout.ejs' });

    });
    });
});

router.get('/dashboard/profile', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  res.locals.path = 'Profile';
  res.render('dash-views/profile.ejs', { layout: 'dashlayout.ejs' });
});

router.get('/dashboard/my-stacks/:stackId/test', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {

  const currentStack = req.params.stackId;

    StackModel.findById(
      currentStack,

      (err, oneStack) => {
        // if there's a database error...
        if (err) {
            // skip to the error handler middleware
            next(err);
            // return to avoid showing the view
            return;

        }

    res.locals.singleStack = oneStack;
    res.locals.path = oneStack.stackName;

    res.render('dash-views/test.ejs', { layout: 'dashlayout.ejs' });

  });
});

router.get('/dashboard/public-stacks', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {

  StackModel.find(

    { shared: 'true' },

    (err, stackList) => {

      if (err) {
          next(err);
          return;
      }

      // send the results to the view
      res.locals.allStacks = stackList;

      res.locals.path = 'Public Stacks';

      res.render('dash-views/public-stacks.ejs', { layout: 'dashlayout.ejs' });

  });
});

module.exports = router;
