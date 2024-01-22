const { Schema, model } = require('mongoose');
const Dish = require('./dish.model');

var MenuSchema = new Schema({
  categories: {
    required: true,
    validate: [categories => categories.length <= 25, "Number of categories exceed the allowed limit"],
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        dishes: {
          required: true,
          type: [Dish],
          validate: [dishes => dishes.length <= 50, "Number of dishes exceed the allowed limit"]
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
