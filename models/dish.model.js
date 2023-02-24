const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DishSchema = Schema({
  dishName: {
    type: String,
    required: true,
  },
  dishDescription: {
    type: String,
  },
  dishPrice: {
    type: Number,
    required: true,
  },
});

module.exports = DishSchema;
