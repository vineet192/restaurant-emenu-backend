const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DishSchema = Schema({
  dishName: {
    type: String,
    required: true,
  },
  dishDesciption: {
    type: String,
  },
  dishPrice: {
    type: Number,
    required: true,
  },
});

module.exports = DishSchema;
