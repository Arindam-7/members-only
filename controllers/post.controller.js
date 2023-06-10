const { NextFunction, Request, Response } = require('express');
const { body, validationResult } = require('express-validator');
const PostModel = require('../models/Post');

exports.get_posts = async (req, res, next) => {
  try {
    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .populate('author');
    return res.render('posts/all_posts', { posts });
  } catch (err) {
    return next(err);
  }
};

exports.post_new_post = [
  body('title')
    .trim()
    .escape()
    .isLength({ min: 3, max: 70 })
    .withMessage(
      'Post title must be a minimum of 3 and a maximum of 70 characters'
    ),

  body('content')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Post content must be a maximum of 500 characters')
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const posts = await PostModel.find({})
          .sort({ createdAt: -1 })
          .populate('author');
        return res.render('posts/all_posts', {
          posts,
          formData: req.body,
          errors: errors.array(),
        });
      }

      const newPost = new PostModel({
        author: req.user,
        title: req.body.title,
        content: req.body.content,
      });
      await newPost.save();
      return res.redirect('/posts');
    } catch (err) {
      return next(err);
    }
  },
];

/** Renderiza formulário de confirmação de remoção de post */
exports.get_remove_post = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id).populate('author');
    if (post) {
      if (req.user?.isAdmin) {
        return res.render('posts/confirmRemove', {
          post,
        });
      }
      return res.render('errorPage', {
        error: {
          status: 403,
          message: `You don't have permissions to delete this post`,
        },
      });
    }
    return res.render('errorPage', {
      error: {
        status: 404,
        message: `The post you are trying to delete does not exist.`,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/** Remove a post */
exports.post_remove_post = async (req, res, next) => {
  try {
    if (req.user?.isAdmin) {
      await PostModel.findOneAndRemove({ _id: req.params.id });
      return res.redirect('/');
    }
    return res.render('errorPage', {
      error: {
        status: 403,
        message: `You don't have permissions to delete this post`,
      },
    });
  } catch (err) {
    return next(err);
  }
};
