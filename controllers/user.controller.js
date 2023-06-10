const { NextFunction, Request, Response } = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { profilePicStorage } = require('../config/multer.config');
const User = require('../models/User');
const { unlink } = require('fs/promises');
const { generateProfilePicPath } = require('../utils/users');

const upload = multer({ storage: profilePicStorage });

exports.get_user_profile = async (req, res, next) => {
  try {
    const userProfile = await User.findOne({ username: req.params.username });
    if (userProfile) {
      return res.render('users/profile', {
        userProfile,
      });
    }
    return res.render('errorPage', {
      error: {
        status: 404,
        message: 'Usuário não encontrado',
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.get_user_profile_edit = async (req, res, next) => {
  if (req.params.username !== req.user.username) {
    return res.render('errorPage', {
      error: {
        status: 403,
        message: 'Você não tem permissões para editar esse usuário',
      },
    });
  }

  try {
    const user = await User.findOne({ username: req.params.username });
    return res.render('users/editProfile', {
      formData: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.get_grant_user_VIP_acess = async (req, res, next) => {
  return res.render('users/getVIP');
};

exports.post_grant_user_VIP_access = [
  body('accessCode')
    .isLength({ min: 8 })
    .custom((value) => {
      return value === process.env.VIP_CODE;
    })
    .withMessage('Código incorreto'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/getVIP', {
        errors: errors.array(),
      });
    }

    try {
      await User.updateOne(
        { username: req.user.username },
        { hasMembership: true }
      );
      return res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
];

exports.post_user_profile_edit = [
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

  async (req, res, next) => {
    if (req.params.username !== req.user.username) {
      return res.render('errorPage', {
        error: {
          status: 403,
          message: 'Você não tem permissões para editar esse usuário',
        },
      });
    }

    try {
      const errors = validationResult(req);
      const userToUpdate = await User.findOne({
        username: req.params.username,
      });

      if (!errors.isEmpty()) {
        return res.render('users/editProfile', {
          formData: { ...req.body, profileImage: userToUpdate.profileImage },
          errors: errors.array(),
        });
      }

      let newProfilePic;
      if (req.file) {
        if (userToUpdate) {
          if (userToUpdate.profileImage) {
            await unlink('public/' + userToUpdate.profileImage);
          }
          newProfilePic = generateProfilePicPath(req.file);
        }
      }

      const newInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profileImage: newProfilePic,
      };
      if (newProfilePic) newInfo.profileImage = newProfilePic;
      await User.updateOne({ username: req.params.username }, newInfo, {});

      return res.redirect('/users/' + req.user.username);
    } catch (error) {
      return next(error);
    }
  },
];
