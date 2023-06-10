const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { userMustBeAuthenticated } = require('../middlewares/auth.middleware');

const userRoutes = Router();

userRoutes.get('/vip', userMustBeAuthenticated, userController.get_grant_user_VIP_acess);
userRoutes.post('/vip', userMustBeAuthenticated, userController.post_grant_user_VIP_access);

userRoutes.get('/:username', userController.get_user_profile);

userRoutes.get('/:username/edit', userMustBeAuthenticated, userController.get_user_profile_edit);
userRoutes.post('/:username/edit', userMustBeAuthenticated, userController.post_user_profile_edit);

module.exports = userRoutes;
