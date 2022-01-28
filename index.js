const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//configure .env
require('dotenv').config();

//configure express
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL

//Defining the routes
menuRoutes = require('./routes/menus');
app.use('/menu', menuRoutes);

//Establishing the database connection.
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology:true}).
catch(error => console.log("Database connection error" + error));

//Validating database connection
var connection = mongoose.connection;
connection.once('open', () => {
  console.log(`database connected successfully! ${connection.db.databaseName}`);
});

//Express server.
app.listen(PORT, () => {
  console.log(`Server started. Listening on port ${app.path() + ":" + PORT}`);
});
