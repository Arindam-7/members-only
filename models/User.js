const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 30,
    unique: true,
  },
  password: { type: String, required: true },
  profileImage: { type: String, required: false },
  hasMembership: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
});

// virtuals
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('url').get(function () {
  return '/users/' + this._id;
});

module.exports = model('User', UserSchema);
