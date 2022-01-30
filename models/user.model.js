const { Schema, model } = require('mongoose');
const Menu = require('./menu.model');

var UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },

  menus: [Menu],
});

const User = model('User', UserSchema)
module.exports = User
