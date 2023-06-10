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
  failureMessage: 'Username ou senha incorretos',
});

module.exports.post_signup = [
  upload.single('profileImage'),

  body('firstName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 30 })
    .withMessage('O nome deve ter de 2 a 30 carcteres'),

  body('lastName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 30 })
    .withMessage('O sobrenome deve ter de 2 a 30 carcteres'),

  body('username')
    .trim()
    .escape()
    .isLength({ min: 5, max: 30 })
    .withMessage('O username deve ter de 5 a 30 carcteres'),

  body('password')
    .escape()
    .isStrongPassword()
    .withMessage(
      'Sua senha deve ter pelo menos 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo'
    )
    .custom((value, { req }) => value === req.body['password2'])
    .withMessage('As senhas não são iguais'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const errorsArray = errors.array();

      const user = await User.findOne({ username: req.body.username });
      if (user)
        errorsArray.push({
          value: req.body.username,
          msg: 'Esse nome de usuário já está em uso',
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

      if (req.file) {
        newUser.profileImage = generateProfilePicPath(req.file);
      }

      await newUser.save();

      return res.render('auth/signup', {
        messages: ['Conta criada com sucesso, você já pode realizar login'],
      });
    } catch (err) {
      return next(err);
    }
  },
];
