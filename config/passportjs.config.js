const { Strategy } = require('passport-local')
const User = require('../models/User')
const { validatePasswordSync } = require('../utils/auth')

const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return done(null, false, { message: 'O usuário não existe' })
    }
    if (validatePasswordSync(password, user.password)) {
      return done(null, user);
    }
    return done(null, false, { message: 'Senha incorreta' })
  } catch (err) {
    done(err);
  }
}

const localStrategy = new Strategy({}, verifyCallback);

const serialize = (user, done) => {
  done(null, user.id)
}

const deserialize = async (id, done) => {
  let user, error

  try {
    user = await User.findById(id);
  } catch (err) {
    error = err
  } finally {
    done(error, user)
  }
}

module.exports = {
  localStrategy,
  serialize,
  deserialize,
}
