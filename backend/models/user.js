const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'not valid address',
    },
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
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?.{1,}\.com\/?(.+)?#?/.test(v);
      },
      message: 'not valid address',
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
