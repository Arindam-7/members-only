const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    profileImage: String,
    hasMembership: Boolean,
    isAdmin: Boolean,
    fullName: String,
    url: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User