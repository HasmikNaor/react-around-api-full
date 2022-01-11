const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?.{1,}\.com\/?(.+)?#?/.test(v);
      },
      message: 'not valid address',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
