const { Schema, model } = require('mongoose');
const { MenuSchema, Menu } = require('./menu.model');

var UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },

  menus: {
    type: [MenuSchema],
    validate: [(menus) => menus.length <= 25, "Number of menus exceed the allowed limit"]
  }
});

const User = model('User', UserSchema);
module.exports = User;
