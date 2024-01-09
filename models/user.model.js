const { Schema, model } = require('mongoose');
const { MenuSchema, Menu } = require('./menu.model');

var UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },

  menus: [MenuSchema]
});

const User = model('User', UserSchema);
module.exports = User;
