const { hash } = require('bcrypt');
const { NextFunction, Request, Response } = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const passport = require('passport');
const { profilePicStorage } = require('../config/multer.config');
const User = require('../models/User');
const { generateProfilePicPath } = require('../utils/users');

const upload = multer({ storage: profilePicStorage });

module.exports.get_login = async (req, res, next) => {
  const messages = req.session.messages || [];
  delete req.session.messages;
  return res.render('auth/login', { messages });
};

module.exports.get_signup = async (req, res, next) => {
  return res.render('auth/signup');
};

module.exports.get_logout = async (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    return res.redirect('/');
  });
};

module.exports.post_login = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/posts',
  failureMessage: 'Incorrect username or password',
});

module.exports.post_signup = [
  upload.single('profileImage'),

  body('firstName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 30 })
    .withMessage('Name must be 2 to 30 characters long'),

  body('lastName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be 2 to 30 characters long'),

  body('username')
    .trim()
    .escape()
    .isLength({ min: 5, max: 30 })
    .withMessage('Username must be between 5 to 30 characters'),

  body('password')
    .escape()
    .isStrongPassword()
    .withMessage(
      'Your password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number and one symbol'
    )
    .custom((value, { req }) => value === req.body['password2'])
    .withMessage('Passwords are not the same'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const errorsArray = errors.array();

      const user = await User.findOne({ username: req.body.username });
      if (user)
        errorsArray.push({
          value: req.body.username,
          msg: 'This username is already in use',
          param: 'username',
          location: 'body',
        });

      if (!errors.isEmpty() || user) {
        return res.render('auth/signup', {
          errors: errorsArray,
          formData: req.body,
        });
      }

      const hashedPassword = await hash(req.body.password, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
      });

      // if (req.file) {
      //   newUser.profileImage = generateProfilePicPath(req.file);
      // }

      await newUser.save();

      return res.render('auth/signup', {
        messages: ['Account created successfully!'],
      });
    } catch (err) {
      return next(err);
    }
  },
];
