const { Schema, model } = require('mongoose');
const Dish = require('./dish.model');

var MenuSchema = new Schema({
  categories: {
    required: true,
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        dishes: {
          required: true,
          type: [Dish],
        },
      },
    ],
  },
  name: {
    required: true,
    type: String,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  currency: {
    required: true,
    type: String,
  },
});
const Menu = model('Menu', MenuSchema);
module.exports = { Menu, MenuSchema };
