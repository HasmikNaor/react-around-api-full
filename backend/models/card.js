const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  likes: [{
    default: [],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('card', cardSchema);
