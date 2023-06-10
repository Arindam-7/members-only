const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const {
  userMustBeAuthenticated,
  userMustBeNotAuthenticated,
} = require('../middlewares/auth.middleware');

const authRoutes = Router();

authRoutes.get('/login', userMustBeNotAuthenticated, authController.get_login);
authRoutes.post('/login', userMustBeNotAuthenticated, authController.post_login);

authRoutes.get('/logout', userMustBeAuthenticated, authController.get_logout);

authRoutes.get('/signup', userMustBeNotAuthenticated, authController.get_signup);
authRoutes.post('/signup', userMustBeNotAuthenticated, authController.post_signup);

module.exports = authRoutes;
