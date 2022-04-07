const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//configure .env
require('dotenv').config();

//configure express
const app = express();
app.use(express.json());

//configure cors
app.use(cors());

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

//Defining the routes
userRoutes = require('./routes/user');
app.use('/user', userRoutes);

menuRoutes = require('./routes/menus');
app.use('/menu', menuRoutes);

//Defining error handler
app.use(function (err, req, res, next) {
  switch (err.type) {
    case 'user_not_found':
      res.status(404).send({
        instance: req.originalUrl,
        title: `User not found`,
        detail: 'The user was not found in the database',
      });
      break;

    case 'menu_not_found':
      res.status(404).send({
        instance: req.originalUrl,
        title: `Menu not found`,
        detail:
          'The menu might have been deleted, try refreshing your webpage or adding the menu again',
      });
      break;

    case 'bad_menu':
      res.status(400).send({
        instance: req.originalUrl,
        title: 'Invalid Menu parameters',
        detail: err.message,
      });
      break

    default:
      console.log(err);
      res.status(500).send({
        instance: req.originalUrl,
        title: 'Server Error',
        detail: err.message,
      });
  }
});

//Establishing the database connection.
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => console.log('Database connection error' + error));

//Validating database connection
var connection = mongoose.connection;
connection.once('open', () => {
  console.log(`database connected successfully! ${connection.db.databaseName}`);
});

//Express server.
app.listen(PORT, () => {
  console.log(`Server started. Listening on port ${app.path() + ':' + PORT}`);
});
