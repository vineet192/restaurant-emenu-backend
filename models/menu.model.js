const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
  currency: {
    required: true,
    type: String,
  },
});
module.exports = MenuSchema;
