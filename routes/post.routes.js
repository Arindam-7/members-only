const { Router } = require('express');
const postController = require('../controllers/post.controller');
const { userMustBeAuthenticated } = require('../middlewares/auth.middleware');

const postRoutes = Router();

postRoutes.get('/', postController.get_posts);

postRoutes.post('/new', userMustBeAuthenticated, postController.post_new_post);

postRoutes.get('/:id/remove', userMustBeAuthenticated, postController.get_remove_post);
postRoutes.post('/:id/remove', userMustBeAuthenticated, postController.post_remove_post);

module.exports = postRoutes;