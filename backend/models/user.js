const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserNotFoundErr = require('../errors/user-not-found-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    default: 'Jacques Cousteau',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Explorer',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    type: String,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UserNotFoundErr('incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UserNotFoundErr('incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
